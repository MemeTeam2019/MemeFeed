from data import db

firestore = db.db


class ItemBasedRecommendation:
    def __init__(self, memes):
        '''Maps each meme_id to the uid of users who have reacted positively
        In addition, memes will be a list of Meme objects (see data/meme.py)
        used to weigh a meme more/less depending on the metric. For example,
        if a meme is popular, we probably want to recommend that meme more than
        a meme which is unpopular.
        '''
        self.uids = self.get_uids()
        self.meme_ids = self.get_meme_ids()
        self.rank_matrix = self.build_matrix()
        self.memes = memes

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
                    matrix[meme_id] = {uid: like_data['rank'] + 1}
                else:
                    matrix[meme_id][uid] = like_data['rank'] + 1
        return matrix

    # All item vectors need to have all user id's in order to generate the
    # comparison between two items. This function will add uid's which have not
    # yet ranked that particular meme with a value of 0
    def complete_vectors(self):
        for _, rank_dict in self.rank_matrix.items():
            for uid in self.uids:
                if uid not in rank_dict:
                    rank_dict[uid] = 0

    # Return the list representation of ranks for the given item
    def vectorize(self, meme_id):
        vector = []
        for _, rank in sorted(self.rank_matrix[meme_id].items()):
            vector.append(rank)
        return vector

    # Fetch all the reacts for the given uid
    def get_target_uid_reacts(self, uid):
        reacts = {}
        for react in firestore.collection(f'Reacts/{uid}/Likes').stream():
            reacts[react.id] = react.to_dict()
        return reacts

    # Calculate the average ranking of the given meme_id
    def average_rank_of(self, meme_id):
        rankings = self.rank_matrix[meme_id]
        total = 0
        for _, rank in rankings:
            total += rank
        return total / len(rankings)

    # Calculate the average rank a user has given
    def average_user_ranking(self, uid):
        pass

    # Calculate the similarity between memes, i and j
    def similarity(self, i, j):
        pass

    def pretty_print_matrix(self):
        check = []
        for meme_id, rank_dict in self.rank_matrix.items():
            check.append(sorted(rank_dict))
            # print(f'( {meme_id} ) -> {rank_vector}')
        print(all(check))

if __name__ == '__main__':
    rec = ItemBasedRecommendation(1)
    rec.complete_vectors()
    rec.pretty_print_matrix()
