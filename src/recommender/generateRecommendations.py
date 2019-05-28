import sys
from data.db import db
from data.meme import Meme
from data.user import User
from userBasedReccomendations import generateRecommendationsByUser
import pprint



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
def consolidateRecommendations(userVotes, itemVotes, subredditVotes):
    finalRecommendations = {}

    uVotes = userVotes.keys()
    mVotes = itemVotes.keys()
    sVotes = subredditVotes.keys()
    # umsVotes is the set that each algorithm found data on
    umsVotes = (uVotes.intersect(mVotes)).intersect(sVotes)
    # update their votes
    uVotes = uVotes.difference(umsVotes)
    mVotes = mVotes.difference(umsVotes)
    sVotes = sVotes.difference(umsVotes)
    # umVotes, usVotes, msVotes are the votes that two of the algorithms found
    # data for
    umVotes = uVotes.intersect(mVotes)
    usVotes = uVotes.intersect(sVotes)
    msVotes = mVotes.intersect(sVotes)
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


    # we are going to go thru all the suggested recommendations and put them in
    # a hashmap

    # the best ones we will give the highest time (to ensure they get shown first)
    # best are the ones that all 3 decided the user would rank highly



    return finalRecommendations

# findConfidence returns the number of ranks that rated this positively
def findConfidence(uRank, rRank, sRank):
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
def voteUsingOneGroup(memeIds, votes, bVotes, recommendation):
    for memeId in memeIds:
        rank = votes[memeId]
        if rank >= 2:
            recommendations[memeId] = {'predictedRank': avgRank,
                                            'confidence': 1 }
    return recommendations


def main():
    # update vectors
    (userVectors , userReactions, userAverageReactions) = updateUserVectors()
    #s memeVectors = updateMemeVectors()
    # subredditVectors = updateSubredditVectors()

    # get recommendations
    userVotes = generateRecommendationsByUser(userVectors, userReactions, userAverageReactions)
    pprint.pprint(userVotes)
    # itemVotes = ''
    # subredditsVotes = ''
    #
    # # vote on recommendations
    # orderedRecommendations = consolidateRecommendations(userVotes, itemVotes, subredditsVotes)

    # return orderedRecommendations


if __name__ == "__main__":
    main()
