from .db import db

class Subreddit:
    def __init__(self, sub_id, data={}):
        try:
            self.sub_id = sub_id
            self.last_reacted = data['lastReacted']
            self.negative_weight = data['negativeWeight']
            self.positive_weight = data['positiveWeight']
            if 'similarSubs' in data:
                self.similar_subs = data['similarSubs']
            else:
                self.similar_subs = []
        except Exception as e:
            print(f'Subreddit instantiation failed for id: {self.sub_id}')
            print(e)
            raise e

    def vectorize(self):
        return [self.last_reacted, self.negative_weight, self.positive_weight, self.similar_subs]
