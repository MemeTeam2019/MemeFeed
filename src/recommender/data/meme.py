import sys
from .db import db

class Meme:
    def __init__(self, meme_id, data):
        try:
            self.meme_id = meme_id
            if 'positiveWeight' in data:
                self.positive_weight = data['positiveWeight']
            else:
                self.positive_weight = 0

            if 'negativeWeight' in data:
                self.negative_weight = data['negativeWeight']
            else:
                self.negative_weight = 0

            if 'reactCount' in data:
                self.popularity = data['reactCount']
            else:
                self.popularity = 0

            if 'lastReacted' in data:
                self.last_reacted = data['lastReacted']
            else:
                self.last_reacted = 0

            self.post_time = data['time']
            self.sub = data['sub']

        except Exception as e:
            print('Failed to instantiate Meme for meme_id:  ' + meme_id)
            print(e)
            raise

    def vectorize(self):
        return [
            self.positive_weight,
            self.negative_weight,
            self.popularity,
            self.last_reacted,
            self.post_time,
            self.sub
        ]

    def store_in_firebase(self):
        vector = self.vectorize()
        db.collection('Memes').document(self.meme_id).update({ 'vector': vector })

    def similarity(self, other):
        pass

    def update(self):
        pass

# docs = db.collection('Memes').stream()
# for doc in docs:
#     meme = Meme(doc.id, doc.to_dict())
#     print(meme.vectorize())
#     meme.store_in_firebase()
#     break
