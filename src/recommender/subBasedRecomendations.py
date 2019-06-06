
def subPosition(thisVector,thisMeme):
    source = thisMeme[5]
    positiveSubs = [thisVector[0], thisVector[1], thisVector[2]]
    negativeSubs =  [thisVector[3], thisVector[4], thisVector[5]]
    if source in positiveSubs:
        return 4-positiveSubs.index(source)

    if source in negativeSubs:
        return -1

    return 0
def similarSubs(thisVector,thisMeme,subVectors):
    rating = 0
    source = thisMeme[5]
    if source == '':
        return 0;
    similarSubs = subVectors[source][3]
    positiveSubs = [thisVector[0], thisVector[1], thisVector[2]]
    negativeSubs =  [thisVector[3], thisVector[4], thisVector[5]]
    for sub in similarSubs:
        if sub in positiveSubs:
            rating+=.5
        if sub in negativeSubs:
            rating-=.1
def popularMeme(memeVector):
    posW = memeVector[0]
    negW = memeVector[1]
    ret = (posW-(negW+1))/3
    if ret is None:
        ret=2
    return ret
def popularSub(subVectors, sub):
    if sub == '':
        return 2
    subVector=subVectors[sub]
    posW = subVector[2]
    negW = subVector[1]
    ret = (posW-(negW+1))/3
    if ret is None:
        ret=2
    return ret
def getValues(thisVector,memeVector,subVectors):
    listVal = [subPosition(thisVector,memeVector),similarSubs(thisVector,memeVector,subVectors), popularMeme(memeVector), popularSub(subVectors,memeVector[5])]
    return listVal

def checkNone(thing):
    if thing is None:
        return 2
    return thing

def consolidate(listVal):
    rating = (checkNone(listVal[0])+checkNone(listVal[1])+ checkNone(listVal[2]) + checkNone(listVal[3])) / 3
    if rating > 4:
        rating= 4
    if rating < 0:
        rating = 0
    return rating
    
def findUnseenMemes(userReactions, thisUser, memeVectors, subVectors):
    unseenMemes = {}
    recommenededMemes = {}
    alreadySeen = userReactions[thisUser]
    for meme in memeVectors:
        # if user hasn't seen the meme yet
        if meme not in alreadySeen:
                unseenMemes[meme] = getValues(thisUser,memeVectors[meme],subVectors)

    # after seeing how similar users felt about these memes we adjust their
    # feelings to this current user
    for meme in unseenMemes:
        recommenededMemes[meme] = consolidate(unseenMemes[meme])

    return recommenededMemes


# recommendMemesByUser generates the recommendations for a single user
def recommendMemesBySub(user, subVectors, memeVectors, userReactions):
    # similarUsers = findSimilarUsers(userVecotrs, user)
    recommenededMemes = findUnseenMemes(userReactions, user, memeVectors, subVectors)
    return recommenededMemes

# generateRecommendationsByUser is treated as the main function and is called
# by the recommender pipeline in order to generate results
def generateRecommendationsBySub(userVectors, userReactions, memeVectors, subVectors):
    for user in userVectors:
        print("new user")
        subRecommendations = recommendMemesBySub(user, subVectors, memeVectors, userReactions)
        print(subRecommendations)









#comment for convient spacing