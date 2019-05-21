
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




    # # Find the similarity between unseenMemes and the memes we have liked
    # # and create a final list of memes to recommend to the user this list has the
    # # id of the meme along with the average rank, and its popularity score with other
    # # users
    # def findSimilarMemes (unseenMemes, currentMemes):
    #     similarMemesToRecommend = {}
    #     for myMeme in currentMemes:
    #         for similarMeme, similarMemeData in unseenMemes:
    #             similarity = standard_similarity(myMeme.vector, similarMeme.vector) # TODO: figure out how to get this
    #             # if two memes are similar
    #             if similarity > .5:
    #                 theirRank = similarMemeData[1] / similarMemeData[1]
    #                 myRank = myMeme.rank # TODO: figure out how to get this
    #
    #                 if similarMeme not in similarMemesToRecommend:
    #                     similarMemesToRecommend[similarMeme] = (0,0,0)
    #
    #                 rankAndWeight = similarMemesToRecommend[similarMeme]
    #
    #                 if theirRank > 1 and myRank > 1:
    #                     avgRank = ((theirRank+myRank)/2 + rankAndWeight[0])/2
    #                     rankAndWeight = (avgRank,)
    #                 elif theirRank < 2 and myRank < 2: # TODO: figure out how to get this
    #                     pass
    #                 elif theirRank > 1 and myRank < 2: # TODO: figure out how to get this
    #                     pass
    #                 else # theirRank < 2 and myRank > 1: # TODO: figure out how to get this
    #                     pass
    #
    #     return {}
    #
    # # take the unseen memes and similar memes and put them together into our final
    # # set of recommendations
    # # these are ordered by their overall popularity with other users
    # def consolidateMemes (unseenMemes, similarMemes):
    #     return {}
