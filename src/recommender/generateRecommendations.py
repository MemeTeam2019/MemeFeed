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
def consolidateRecommendations(userVotes, itemVotes, subredditsVotes):
    pass

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
