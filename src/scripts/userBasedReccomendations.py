from sklearn.feature_extraction.text import TfidfVectorizer

vectorizer = TfidfVectorizer()


def standard_similarity (a, b):
    return 0


def cosine_sim (text1, text2):
    tfidf = vectorizer.fit_transform([text1, text2])
    return ((tfidf * tfidf.T).A)[0,1]

# we define our own cosine similarity function since the vectors contain strings
def similarity (a, b):
    # compute similarity between top 3 subreddits
    ATopThree = " ".join(a[0:3])
    BTopThree = " ".join(b[0:3])
    topThreeSimilarity = cosine_sim(ATopThree, BTopThree)

    # compute similarity between bottom 3 subreddits
    ABottomThree = " ".join(a[3:6])
    BBottomThree = " ".join(b[3:6])
    bottomThreeSimilarity = cosine_sim(ABottomThree, BBottomThree)

    # compute similarity between  most recent subreddits
    ARecentThree = " ".join(a[6:9])
    BRecentThree = " ".join(b[6:9])
    recentThreeSimilarity = cosine_sim(ARecentThree, BRecentThree)

    # compute similarity between most popular subreddits
    APopularThree = " ".join(a[9:12])
    BPopularThree = " ".join(b[9:12])
    popularThreeSimilarity = cosine_sim(ARecentThree, BRecentThree)

    averageSimilarity = (topThreeSimilarity + bottomThreeSimilarity + recentThreeSimilarity + popularThreeSimilarity)/4
    return averageSimilarity

# Find users most similar to you (similar_users = {} key: uid, value: similarity)
def findSimilarUsers (allUsers, thisUser):
    similarUsers = {}
    for user in allUsers:
        similarity = similarity(user.vectorize(), thisUser.vectorize()):

        # more similar than not
        if similarity > .5:
            similarUsers[user.uid] = similarity

    return similarUsers

# Find the memes these users have reacted to that you haven’t
def findUnseenMemes (similarUsers, currentMemes):
    similarMemes = {}
    for user in similarUsers:
        for meme in user.memes:
            # if user hasn't seen the meme yet
            if meme not in currentMemes:
                if meme not in similarMemes:
                    similarMemes[meme] = (0,0,0)

                # TODO: FIND A BETTER WAY TO CALCULATE THIS WEIGHT
                memeWeight = similarMemes[meme][0] + (meme.rank*similarUsers[user])
                ranking = similarMemes[meme][1] + meme.rank
                view = similarMemes[meme][2] + 1
                similarMemes[meme] = memeWeight

    return similarMemes

# Find the similarity between unseenMemes and the memes we have liked
# and create a final list of memes to recommend to the user
def findSimilarMemes (unseenMemes, currentMemes):
    for myMeme in currentMemes:
        for similarMeme in unseenMemes:


    return {}

# take the unseen memes and similar memes and put them together into our final
# set of recommendations
def consolidateMemes (unseenMemes, similarMemes):
    return {}

# this acts as our main function that gets called by the main recommendation Pipeline
def recommendMemesByUser(thisUser, otherUsers, memes):
    similarUsers = findSimilarUsers(otherUsers, thisUser)
    unseenMemes = findUnseenMemes(similarUsers, myMemes)
    similarMemes = findSimilarMemes(unseenMemes, myMemes)
    finalRecommendations = consolidateMemes(unseenMemes, similarMemes)
    return finalRecommendations
