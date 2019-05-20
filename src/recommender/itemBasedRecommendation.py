from data import db
firestore = db.db

class ItemBasedRecommendation:
    def __init__(self):
        # Maps each meme_id to the uid of users who have reacted positively
        self.uids = self.get_uids()
        self.meme_ids = self.get_meme_ids()
        self.rank_matrix = self.build_matrix()

    # Fetch all uids from the Users collection
    def get_uids(self):
        uids = []
        for user in firestore.collection('Users').stream():
            uids.append(user.id)
        return uids

    # Fetch all meme ids from the Memes collection
    def get_meme_ids(self):
        meme_ids = []
        for meme in firestore.collection('Memes').stream():
            meme_ids.append(meme.id)
        return meme_ids

    # Fetch all reacts from the Reacts collection, storing them as a
    # dictionary which maps meme_id -> { uid: rank }
    def build_matrix(self):
        matrix = {}
        for uid in self.uids:
            for meme in firestore.collection(f'Reacts/{uid}/Likes').stream():
                meme_id = meme.id
                like_data = meme.to_dict()
                if meme_id not in matrix:
                    matrix[meme_id] = { uid: like_data['rank'] }
                else:
                    matrix[meme_id][uid] = like_data['rank']
        return matrix

    # All vectors need to have
    def vectorize(self):
        for _, rank_dict in self.rank_matrix:


    # Fetch all the reacts for the given uid
    def get_target_uid_reacts(self, uid):
        reacts = {}
        for react in firestore.collection(f'Reacts/{uid}/Likes').stream():
            reacts[react.id] = react.to_dict()
        return reacts

    # Calculate the average ranking of the given meme
    def average_rank_of(self, meme_id):
        rankings = self.rank_matrix[meme_id]
        total = 0
        for _, rank in rankings:
            total += rank
        return total / len(rankings)

    def average_user_ranking(self, uid):
        pass

    # Calculate the similarity between memes, i and j
    def similarity(self, i, j):
        pass

