from data import db, Meme, User

firestore = db.db

class ItemBasedRecommendation:
    def __init__(self):
        self.ratings_matrix = [[]]

    def build_matrix(self):
        users_ref = firestore.collection('Users').stream()
        memes_ref = firestore.collection('Memes').stream()

    def compare_items(self, first_item, second_item):
        pass

