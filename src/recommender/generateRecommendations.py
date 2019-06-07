import sys
from data.db import db
from data.meme import Meme
from data.user import User
from userBasedReccomendations import generateRecommendationsByUser
import pprint
import time
from subBasedRecomendations import generateRecommendationsBySub
from itemBasedRecommendation import ItemBasedRecommendation


# STEP 1 ------------------------------------------------------- update vectors
# updateUserVectors updates the user vectors and returns them as a hashmap
# where key: uid and value: vector
def updateUserVectors():
    userVectors = {}
    userReactions = {}
    userAverageReactions = {}
    users = db.collection('Users').stream()

    for user in users:
        u = User(user.id, user.to_dict())
        memes = {}
        for id, meme in u.get_reacts().items():
            memes[id] =  meme['rank']

        userReactions[user.id] = memes
        userAverageReactions[user.id] = u.average_ranking()
        userVectors[user.id] = u.vectorize()

    return (userVectors, userReactions, userAverageReactions)

# updateMemeVectors updates the meme vectors and returns them as a hashmap
# where key: meme-id and value: vector
def updateMemeVectors():
    memeVectors = {}
    docs = db.collection('Memes').stream()
    for doc in docs:
        meme = Meme(doc.id, doc.to_dict())
        memeVectors[doc.id] = meme.vectorize()

    return memeVectors


# updateSubredditVectors updates the subreddit vectors and returns them as a
# hashmap where key: meme-id and value: vector
def updateSubredditVectors():
    pass

# STEP 2 ----------------------------------------------------- consolidate votes
# consolidateRecommendations finds the final set of recommendations for each
# user and then stores them in firebase
def consolidateRecommendations(userVotes, itemVotes, subredditVotes):
    # get final recommendations for each user
    finalRecommendations = {}
    currentTime = time.time()
    for user in userVotes:
        finalRecommendations[user] = consolidateRecommendationsByUser(user,
            userVotes[user],
            itemVotes[user],
            subredditVotes[user])

        # store each recommended meme in firebase
        for meme in finalRecommendations[user]:
            rec_ref = db.collection(f'Recommendations/{user}/Memes').document(meme)
            rank = round(finalRecommendations[user][meme]['predictedRank'])
            modifiedTime = time.time() + rank + finalRecommendations[user][meme]['confidence']

            recommendation_doc = rec_ref.get()
            # if worth putting in the recommendations and its not already there
            if rank >= 2 and recommendation_doc.to_dict() == None:
                # if document doesn't exist, put it there
                doc_ref = db.collection('Memes').document(meme)
                memeDoc = doc_ref.get()
                memeData = memeDoc.to_dict()
                if memeData == None:
                    continue
                try:
                    if memeData['sub'] != None :
                        rec_ref.set({
                            'time': modifiedTime,
                            'url': memeData['url'],
                            'sub': memeData['sub']
                        })
                    else:
                        rec_ref.set({
                            'time': modifiedTime,
                            'url': memeData['url'],
                            'author': memeData['author']
                        })
                except: 
                    rec_ref.set({
                        'time': modifiedTime,
                        'url': memeData['url'],
                        'author': memeData['author']
                    })


# consolidateRecommendationsByUser creates the final set of recommendations for
# a given user
def consolidateRecommendationsByUser(user, userVotes, itemVotes, subredditVotes):
    finalRecommendations = {}

    uVotes = set(userVotes.keys())
    mVotes = set(itemVotes.keys())
    sVotes = set(subredditVotes.keys())
    # umsVotes is the set that each algorithm found data on
    umsVotes = (uVotes.intersection(mVotes))
    umsVotes = umsVotes.intersection(sVotes)
    # update their votes
    uVotes = uVotes.difference(umsVotes)
    mVotes = mVotes.difference(umsVotes)
    sVotes = sVotes.difference(umsVotes)
    # umVotes, usVotes, msVotes are the votes that two of the algorithms found
    # data for
    umVotes = uVotes.intersection(mVotes)
    usVotes = uVotes.intersection(sVotes)
    msVotes = mVotes.intersection(sVotes)
    # uVotes, mVotes, sVotes now only contain the votes that one algorithm found
    uVotes = (uVotes.difference(umVotes)).difference(usVotes)
    mVotes = (mVotes.difference(umVotes)).difference(msVotes)
    sVotes = (sVotes.difference(usVotes)).difference(msVotes)

    # look at memes we have the most data for
    for memeId in umsVotes:
        uRank = userVotes[memeId]
        mRank = itemVotes[memeId]
        sRank = subredditVotes[memeId]
        avgRank = (uRank + mRank + sRank)/3
        if avgRank >= 2:
            # confidence measures how many of the algorithms ranked this meme highly
            confidence = findConfidence(uRank, mRank, sRank)
            finalRecommendations[memeId] = {'predictedRank': avgRank,
                                            'confidence': confidence }

    finalRecommendations = voteUsingTwoGroups(umVotes, userVotes, itemVotes, finalRecommendations)
    finalRecommendations = voteUsingTwoGroups(usVotes, userVotes, subredditVotes, finalRecommendations)
    finalRecommendations = voteUsingTwoGroups(umVotes, itemVotes, subredditVotes, finalRecommendations)
    finalRecommendations = voteUsingOneGroup(uVotes, userVotes, finalRecommendations)
    finalRecommendations = voteUsingOneGroup(mVotes, itemVotes, finalRecommendations)
    finalRecommendations = voteUsingOneGroup(sVotes, subredditVotes, finalRecommendations)


    return finalRecommendations

# findConfidence returns the number of ranks that rated this positively
def findConfidence(uRank, mRank, sRank):
    confidence = 0
    confidence = 1 if uRank > 1 else 0
    confidence = confidence + 1 if sRank > 1 else confidence
    confidence = confidence + 1 if mRank > 1 else confidence
    return confidence

# voteUsingTwoGroups predicts a recommendation when there are two groups that
# have data for a meme
def voteUsingTwoGroups(memeIds, aVotes, bVotes, recommendations):
    for memeId in memeIds:
        aRank = aVotes[memeId]
        bRank = bVotes[memeId]
        avgRank = (aRank + bRank)/2
        if avgRank >= 2:
            # confidence measures how many of the algorithms ranked this meme highly
            confidence = findConfidence(aRank, bRank, 0)
            recommendations[memeId] = {'predictedRank': avgRank,
                                            'confidence': confidence }
    return recommendations

# voteUsingOneGroup predicts a recommendation when there is only one group that
# has data for a meme
def voteUsingOneGroup(memeIds, votes, recommendations):
    for memeId in memeIds:
        rank = votes[memeId]
        if rank >= 2:
            recommendations[memeId] = {'predictedRank': avgRank,
                                            'confidence': 1 }
    return recommendations


def main():
    # update vectors
    (userVectors , userReactions, userAverageReactions) = updateUserVectors()
    memeVectors = updateMemeVectors()
    subVectors = updateSubredditVectors()

    # get recommendations
    userVotes = generateRecommendationsByUser(userVectors, userReactions, userAverageReactions)
    itemVotes = ItemBasedRecommendation().generate_recommendations()
    # subredditsVotes = generateRecommendationsBySub(userVectors, userReactions, memeVectors, subVectors)
    
    # vote on recommendations
    orderedRecommendations = consolidateRecommendations(userVotes, itemVotes, userVotes)



if __name__ == "__main__":
    main()

class MemeData(object):
    def __init__(self, url, sub):
        self.url = url
        self.sub = sub

