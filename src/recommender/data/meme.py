from db import db

class Meme:
    def __init__(self, meme_id, data):
        try:
            self.meme_id = meme_id
            self.positive_weight = data['positiveWeight']
            self.negative_weight = data['negativeWeight']
            self.popularity = data['reactCount']
            self.last_reacted = data['lastReacted']
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

    def update(self):
        pass

docs = db.collection('Memes').stream()
for doc in docs:
    meme = Meme(doc.id, doc.to_dict())
    print(meme.vectorize())
    meme.store_in_firebase()
    break


