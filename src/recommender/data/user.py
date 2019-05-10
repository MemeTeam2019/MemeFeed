from db import db
from collections import Counter

class User:
    def __init__(self, uid, data):
        try:
            self.uid = uid
            self.rank_subreddits()
            self.rank_users()
        except Exception as e:
            print('Failed to instantiate object for user ' + uid)
            print(e)
            raise

    def rank_subreddits(self):
        subreddit_counter = Counter()
        reacts = db \
            .collection('Reacts') \
            .document(self.uid) \
            .collection('Likes') \
            .stream()
        for react in reacts:
            meme_data = db.collection('Memes').document(react.id).to_dict()
            react_data = react.to_dict()
            rank = react_data['rank']
            likedFrom = meme_data['sub']
            if likedFrom != '':
                if likedFrom not in subreddit_counter:
                    react_data['likedFrom'] = 0
                if rank >= 2:
                    subreddit_counter[likedFrom] += rank
                else:
                    subreddit_counter[likedFrom] += rank - 4

        top_subreddits = subreddit_counter.most_common(len(subreddit_counter))
        self.top_1_subreddit = top_subreddits[0][0]
        self.top_2_subreddit = top_subreddits[1][0]
        self.top_3_subreddit = top_subreddits[2][0]
        self.bottom_1_subreddit = top_subreddits[-1][0]
        self.bottom_2_subreddit = top_subreddits[-2][0]
        self.bottom_3_subreddit = top_subreddits[-3][0]

    def rank_users(self):
        user_counter = Counter()
        reacts = db \
            .collection('Reacts') \
            .document(self.uid) \
            .collection('Likes') \
            .stream()
        for react in reacts:
            react_data = react.to_dict()
            rank = react_data['rank']
            likedFrom = react_data['likedFrom']
            user_ref = db.collection('Users').document(likedFrom)
            try:
                user_ref.get()
                if likedFrom not in user_counter:
                    react_data['likedFrom'] = 0
                if rank >= 2:
                    user_counter[likedFrom] += rank
                else:
                    user_counter[likedFrom] += rank - 4
            except:
                continue

        top_users = user_counter.most_common(len(user_counter))
        self.top_1_user = top_users[0][0]
        self.top_2_user = top_users[1][0]
        self.top_3_user = top_users[2][0]
    
    def vectorize(self):
        return [
            self.top_1_subreddit,
            self.top_2_subreddit,
            self.top_3_subreddit,
            self.bottom_1_subreddit,
            self.bottom_2_subreddit,
            self.bottom_3_subreddit,
            self.top_1_user,
            self.top_2_user,
            self.top_3_user
        ]

    def recent_subreddits(self):
        pass

users = db.collection('User').stream()
for user in users:
    u = User(user.id, user.data)
    print(u.vectorize())
    break