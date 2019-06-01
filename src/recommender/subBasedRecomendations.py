
def subPosition(thisVector,thisMeme):
    source = thisMeme.sub
    positiveSubs = [thisVector.top_1_subreddit, thisVector.top_2_subreddit, thisVector.top_3_subreddit]
    negativeSubs =  [thisVector.bottom_1_subreddit, thisVector.bottom_2_subreddit, thisVector.bottom_3_subreddit]
    if source in positiveSubs:
        return 4-positiveSubs.index(source)

    if source in negativeSubs:
        return -1

    return 0
def similarSubs(thisVector,thisMeme,subVectors):
    rating = 0
    source = thisMeme.sub
    similarSubs = subVectors[source].similarSubs
    positiveSubs = [thisVector.top_1_subreddit, thisVector.top_2_subreddit, thisVector.top_3_subreddit]
    negativeSubs =  [thisVector.bottom_1_subreddit, thisVector.bottom_2_subreddit, thisVector.bottom_3_subreddit]
    for sub in similarSubs:
        if sub in positiveSubs:
            rating+=.5
        if sub in negativeSubs:
            rating-=.1
def popularMeme(memeVector):
    osW = memeVector.positiveWeight
    negW = memeVector.negativeWeight
    return (posW/negW)/2
def popularSub(subVector):
    posW = subVector.positiveWeight
    negW = subVector.negativeWeight
    return (posW/negW)/2
def getValues(thisVector,memeVector,subVectors):
    listVal = [subPosition(thisVector,memeVector),similarSubs(thisVector,memeVector,subVectors), popularMeme(memeVector), popularSub(subVectors[memeVectors.sub])]
    return listVal
def consolidate(listVal):
    rating = (listVal[0]+listVal[1]+ listVal[2] + listVal[3]) / 4
    if rating > 4:
        rating= 4
    if rating < 0:
        rating = 0
    return rating
def findUnseenMemes(userReactions, thisUser, memeVectors, subVectors):
    unseenMemes = {}
    recommenededMemes = {}
    alreadySeen = userReactions[thisUser]
    thisVector = userVectors[thisUser]


        for meme in memeVectors:
            # if user hasn't seen the meme yet
            if meme not in alreadySeen:
                    unseenMemes[meme] = getValues(thisUser,memeVectors[meme],subVectors)

    # after seeing how similar users felt about these memes we adjust their
    # feelings to this current user
    for meme in unseenMemes:
        recommenedMemes[meme] = consolidate(unseenMemes[meme])

    return recommenedMemes


# recommendMemesByUser generates the recommendations for a single user
def recommendMemesBySub(user, subVectors, memeVectors, userReactions):
    # similarUsers = findSimilarUsers(userVecotrs, user)
    recommenededMemes = findUnseenMemes(userReactions, user, memeVectors, subVectors)
    return recommenededMemes

# generateRecommendationsByUser is treated as the main function and is called
# by the recommender pipeline in order to generate results
def generateRecommendationsBySub(userVectors, userReactions, memeVectors, subVectors):
    for user in userVectors:
        subRecommendations = recommendMemesBySub(user, subVectors, memeVectors, userReactions)
        print(subRecommendations)









#comment for convient spacing