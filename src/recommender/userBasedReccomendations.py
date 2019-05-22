
# similarityTopAndBottom computes two users similarity
def generalSimilarity(a, b):
    similarity = 0
    weight = {0:3, 1:2, 2:1}
    for idxA, item in enumerate(a):
        if item in b:
            idxB = b.index(item)
            sum = weight[idxB] + weight[idxA]
            sum = sum + 1if idxA == idxB else sum
            similarity += sum

    return similarity/15


# similarityTopAndBottom computes two users similarity based on their top and
# bottom subreddits
def similarityTopAndBottom(a, b):
    similarity = 0
    # associated weight for each index
    weight = {0:3, 1:2, 2:1, 3:3, 4:2, 5:1]
    for idxA, item in enumerate(a):
        if item in b:
            idxB = b.index(item)
            sum = weight[idxB] + weight[idxA]
            # reward if they had the exact same rank
            sum = sum+1 if idxA == idxB else sum
            if idxA > 2 and idxB > 2:
                similarity += sum
            elif idxA < 3 and idxB < 3:
                similarity += sum
            else:
                similarity -= sum

    return similarity/30

# we define our own cosine similarity function since the vectors contain strings
def similarity (a, b):
    # compute similarity between top 3 subreddits
    ARankings = " ".join(a[0:6])
    BRankings = " ".join(b[0:6])
    similarityRankings = similarityTopAndBottom(ATopThree, BTopThree)

    # compute similarity between  most recent subreddits
    ARecentThree = " ".join(a[6:9])
    BRecentThree = " ".join(b[6:9])
    recentThreeSimilarity = generalSimilarity(ARecentThree, BRecentThree)

    # compute similarity between most popular subreddits
    APopularThree = " ".join(a[9:12])
    BPopularThree = " ".join(b[9:12])
    popularThreeSimilarity = generalSimilarity(ARecentThree, BRecentThree)

    averageSimilarity = (similarityRankings + recentThreeSimilarity + popularThreeSimilarity)/3
    return averageSimilarity

# Find users most similar to you (similar_users = {} key: uid, value: similarity)
def findSimilarUsers (allUsers, thisUser):
    similarUsers = {}
    for user in allUsers:
        similarity = similarity(user.vectorize(), thisUser.vectorize()): # TODO: figure out how to get this

        if similarity > 0:
            similarUsers[user.uid] = similarity

    return similarUsers

# Find the memes these users have reacted to that you haven’t
# For each meme we are given the average, and its overall weight, its weight
# marks the popularity of the meme
def findUnseenMemes (similarUsers, currentMemes, thisUser):
    unseenMemes = {}
    recommenededMemes = {}
    averageUserRanking = thisUser.averageRank # TODO: figure out how to get this

    # find all the memes this user has not seen
    for user, similarity in similarUsers:
        averageRank = user.averageRank # TODO: figure out how to get this
        for meme in user.memes: # TODO: figure out how to get this
            # if user hasn't seen the meme yet
            if meme not in currentMemes:
                if meme not in similarMemes:
                    unseenMemes[meme] = (0,0,0)

                userRank = meme.rank # TODO FIGURE OUT HOW TO GET THIS

                unseenMemes[meme][0] += (userRank-averageRank)*similarity
                unseenMemes[meme][1] += abs(similarity)

    # after seeing how similar users felt about these memes we adjust their
    # feelings to this current user
    for meme, fraction in unseenMemes:
        similarUsersNetFeelings = fraction[0]/fraction[1]
        recommenedMemes[meme] = averageUserRanking + similarUsersNetFeelings

    return recommenedMemes


# this acts as our main function that gets called by the main recommendation Pipeline
def recommendMemesByUser(thisUser, otherUsers, memes):
    similarUsers = findSimilarUsers(otherUsers, thisUser)
    recommenededMemes = findUnseenMemes(similarUsers, myMemes)
    return recommenededMemes


def generateRecommendationsByUser(users, userReactions):
    pass
