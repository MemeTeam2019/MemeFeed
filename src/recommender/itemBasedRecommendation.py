from typing import list, dict
from data import db

firestore = db.db


class ItemBasedRecommendation:
    def __init__(self, memes):
        # Maps each meme_id to the uid of users who have reacted positively
        self.uids: list = self.get_uids()
        self.meme_ids: list = self.get_meme_ids()
        self.rank_matrix: dict = self.build_matrix()
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

    # All vectors need to have
    def complete_vector(self):
        for _, rank_dict in self.rank_matrix:
            for meme_id in self.meme_ids:
                if meme_id not in rank_dict:
                    rank_dict[meme_id] = 0

    # Return the list representation of ranks for the given item
    def vectorize(self, meme_id: str) -> list:
        vector = []
        for _, rank in sorted(self.rank_matrix[meme_id]):
            vector.append(rank)
        return vector

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

    # Calculate the average rank a user has given
    def average_user_ranking(self, uid):
        pass

    # Calculate the similarity between memes, i and j
    def similarity(self, i, j):
        pass


if __name__ == '__main__':
    rec = ItemBasedRecommendation()
