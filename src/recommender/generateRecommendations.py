from userBasedRecommendations import generateRecommendationsByUser
from db import db


# STEP 1 ------------------------------------------------------- update vectors

# updateUserVectors updates the user vectors and returns them as a hashmap
# where key: uid and value: vector
def updateUserVectors():
    userVectors = {}
    users = db.collection('Users').stream()
    for user in users:
        u = User(user.id, user.to_dict())
        userReactions[user.id] = u.vectorize()

    return userVecotrs

# updateMemeVectors updates the meme vectors and returns them as a hashmap
# where key: meme-id and value: vector
def updateMemeVectors():
    memeVectors = {}
    docs = db.collection('Memes').stream()
    for doc in docs:
        meme = Meme(doc.id, doc.to_dict())
        memeVectors[meme.id] = meme.vectorize()

    return memeVectors


# updateSubredditVectors updates the subreddit vectors and returns them as a
# hashmap where key: meme-id and value: vector
def updateSubredditVectors():
    pass

# STEP 1 ---------------------------------------------- get other necessary data
# getUserReactions returns a hashmap of user's reactions by userId where key: uid and
# value: hashmap where key: memeId and value: rank
def getUserReactions():
    userReactions = {}
    users = db.collection('Users').stream()
    for user in users:
        u = User(user.id, user.to_dict())
        userReactions[user.id] = u.get_reacts()

    return (userReactions, userAverageReactions)


# STEP 3 ----------------------------------------------------- consolidate votes
def consolidateRecommendations(userVotes, itemVotes, subredditsVotes):
    pass

def main():
    # update vectors
    userVectors = updateUserVectors()
    memeVectors = updateMemeVectors()
    subredditVectors = updateSubredditVectors()
    (userReactions, userAverageReactions) = getUserReactions()

    # get recommendations
    userVotes = generateRecommendationsByUser(userVectors, userReactions, userAverageReactions)
    itemVotes = ''
    subredditsVotes = ''

    # vote on recommendations
    orderedRecommendations = consolidateRecommendations(userVotes, itemVotes, subredditsVotes)

    return (orderedRecommendations)



if __name__ == "__main__":
    main()
