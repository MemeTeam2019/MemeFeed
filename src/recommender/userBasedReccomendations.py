import pprint

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
    weight = {0:3, 1:2, 2:1, 3:3, 4:2, 5:1}
    for idxA, item in enumerate(a):
        # if the user doesn't have something here ignore it
        if item == '':
            continue
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
                # if they are the exact oposite of each other add an extra 1 in
                # order to penalize it
                sum = sum+1 if weight[idxA] == weight[idxB] else sum
                similarity -= sum

    return similarity/30

# we define our own cosine similarity function since the vectors contain strings
def similarity (a, b):
    # compute similarity between top 3 subreddits
    ARankings = a[0:6]
    BRankings = b[0:6]
    similarityRankings = similarityTopAndBottom(ARankings, BRankings)

    # compute similarity between  most popularUsers
    ARecentThree = a[6:9]
    BRecentThree = b[6:9]
    popularUsers = generalSimilarity(ARecentThree, BRecentThree)

    averageSimilarity = (similarityRankings*(2/3) + popularUsers*(1/3))
    return averageSimilarity

# Find users most similar to you (similar_users = {} key: uid, value: similarity)
def findSimilarUsers (userVectors, thisUser):
    similarUsers = {}
    thisVector = userVectors[thisUser]
    for user, vector in userVectors.items():
        sim = similarity(vector, thisVector)
        similarUsers[user] = sim

    return similarUsers

# Find the memes these users have reacted to that you haven’t
# For each meme we are given the average, and its overall weight, its weight
# marks the popularity of the meme
def findUnseenMemes(similarUsers, userReactions, userAverageReactions, thisUser):
    unseenMemes = {}
    recommenededMemes = {}
    averageUserRanking = userAverageReactions[thisUser]+1
    alreadySeen = userReactions[thisUser]

    # find all the memes this user has not seen
    for user, similarity in similarUsers.items():
        averageRank = userAverageReactions[user] + 1
        if userReactions[user] != None:
            for meme in userReactions[user]:
                # if user hasn't seen the meme yet
                if meme not in alreadySeen:
                    if meme not in unseenMemes:
                        unseenMemes[meme] = {}
                        unseenMemes[meme]['userFeelings'] = 0
                        unseenMemes[meme]['similaritySum'] = 0

                    userRank = userReactions[user][meme]+1
                    unseenMemes[meme]['userFeelings'] += (userRank-averageRank)*similarity
                    unseenMemes[meme]['similaritySum'] += abs(similarity)

    # after seeing how similar users felt about these memes we adjust their
    # feelings to this current user
    for meme, fraction in unseenMemes.items():
        if fraction['similaritySum'] != 0:
            similarUsersNetFeelings = fraction['userFeelings']/fraction['similaritySum']
            suggestedRank = averageUserRanking + similarUsersNetFeelings - 1
            suggestedRank = 4 if suggestedRank > 4 else suggestedRank
            suggestedRank = 0 if suggestedRank < 0 else suggestedRank
            recommenededMemes[meme] = suggestedRank

    return recommenededMemes


# recommendMemesByUser generates the recommendations for a single user
def recommendMemesByUser(user, userVectors, userReactions, userAverageReactions):
    similarUsers = findSimilarUsers (userVectors, user)
    recommenededMemes = findUnseenMemes(similarUsers, userReactions, userAverageReactions, user)
    print ('RECOMMENDING:')
    pprint.pprint(recommenededMemes)
    return recommenededMemes

# generateRecommendationsByUser is treated as the main function and is called
# by the recommender pipeline in order to generate results
def generateRecommendationsByUser(userVectors, userReactions, userAverageReactions):
    for user in userVectors:
        memeRecommendations = recommendMemesByUser(user, userVectors, userReactions, userAverageReactions)
