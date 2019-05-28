from data import db
import numpy as np

firestore = db.db


class ItemBasedRecommendation:
    def __init__(self, memes=[]):
        '''Maps each meme_id to the uid of users who have reacted positively
        In addition, memes will be a list of Meme objects (see data/meme.py)
        used to weigh a meme more/less depending on the metric. For example,
        if a meme is popular, we probably want to recommend that meme more than
        a meme which is unpopular.
        '''
        self.uids = self.get_uids()
        self.meme_ids = self.get_meme_ids()
        self.rank_matrix = self.build_matrix()
        self.similar_memes = self.group_similar_items()
        self.all_reacts = self.get_all_reacts()
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

    # Fetch all the reacts for the given uid
    def get_user_reacts(self, uid):
        reacts = {}
        for react in firestore.collection(f'Reacts/{uid}/Likes').stream():
            reacts[react.id] = react.to_dict()['rank'] + 1
        for meme_id in self.meme_ids:
            if meme_id not in reacts:
                reacts[meme_id] = 0
        return reacts

    def get_all_reacts(self):
        all_reacts = {}
        for uid in self.uids:
            all_reacts[uid] = self.get_user_reacts(uid)
        return all_reacts

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
        for _, rank_dict in matrix.items():
            for uid in self.uids:
                if uid not in rank_dict:
                    rank_dict[uid] = 0
        return matrix

    # Return the rank vector of the given meme_id.
    # NOTE: the vector will be a numpy array
    def vectorize(self, meme_id):
        vector = []
        for _, rank in sorted(self.rank_matrix[meme_id].items()):
            vector.append(rank)
        return np.array(vector)

    # Converts rank_matrix rank_dicts to numpy arrays
    def vectorize_all(self):
        item_vectors = {}
        for item_id, rank_dict in self.rank_matrix.items():
            item_vectors[item_id] = self.vectorize(item_id)
        return item_vectors

    # Use similarity ranking (in this case, cosine similarity) to group
    # Similar memes together
    def group_similar_items(self):
        groups = {}
        matrix = self.vectorize_all()
        meme_ids = sorted(matrix)
        # Compare every item to every other item
        for i, id1 in enumerate(meme_ids):
            vec1 = matrix[id1]
            for id2 in meme_ids[i+1:]:
                vec2 = matrix[id2]
                similarity = self.cosine_similarity(vec1, vec2)
                if similarity >= 0.5:
                    if id1 not in groups:
                        groups[id1] = [(id2, similarity)]
                    else:
                        groups[id1].append((id2, similarity))
                    if id2 not in groups:
                        groups[id2] = [(id1, similarity)]
                    else:
                        groups[id2].append((id1, similarity))
        return groups

    # Calculate the average ranking of the given meme_id
    def average_item_rank_of(self, meme_id):
        rank_dict = self.rank_matrix[meme_id]
        total = sum(rank for _, rank in rank_dict.items())
        return total / len(rank_dict)

    # Calculate the average rank a user has given
    def average_user_rank_of(self, uid):
        total_rank = 0
        number_of_documents = 0
        for like in db.collection(f'Reacts/{uid}/Likes').stream():
            total_rank += like['rank']
            number_of_documents += 1
        return total_rank / number_of_documents

    # Output the cosine similarity of vectors i and j
    # sim(i, j) = cos(i, j) = (i dot j) / (norm(i) * norm(j))
    # i and j should be numpy arrays
    def cosine_similarity(self, i, j):
        try:
            return np.divide(i.dot(j), np.sqrt(i.dot(i)) * np.sqrt(j.dot(j)))
        except Exception:
            return -1

    # Prints all item_ids and their associated rank vector
    def pretty_print_matrix(self):
        for meme_id, _ in self.rank_matrix.items():
            print(f'uid: {meme_id} -> {self.vectorize(meme_id)}')

    # Predicts the ranking of a user for a particular item using the weighted
    # sum. Computes the sum of ratings given by the user on the items similar
    # to the item, with each rating being weighted by the similarity between
    # the two items.
    def predict_rank(self, uid, meme_id):
        # Memes which have a similarity rating >= 0.5 to meme_id
        similar_memes = self.similar_memes[meme_id]
        # All the reacts associated with this uid
        user_ranks = self.all_reacts[uid]
        # Don't output if the user has already ranked the meme
        if user_ranks[meme_id] == 0:
            return -1
        numerator = denominator = 0
        for meme_id, similarity in similar_memes:
            numerator += similarity * user_ranks[meme_id]
            denominator += similarity
        return np.divide(numerator, denominator)


if __name__ == '__main__':
    rec = ItemBasedRecommendation()
    uids = rec.uids
    meme_ids = rec.meme_ids
    recommendations = {}
    for uid in uids:
        for meme_id in meme_ids:
            try:
                predicted = rec.predict_rank(uid, meme_id) - 1
                if predicted >= 2:
                    if uid in recommendations:
                        recommendations[uid].append((meme_id, predicted))
                    else:
                        recommendations[uid] = [(meme_id, predicted)]
            except Exception:
                continue
    for uid, prediction in recommendations.items():
        print(f'{uid} -> [')
        for meme_id, rank in prediction:
            print(' ' * (len(uid) + 7) + f'{rank:.5f} predicted for {meme_id}')
        print(' ' * (len(uid) + 4) + ']')
        print()
