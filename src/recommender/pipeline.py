from data import User, Meme, Subreddit, db

class Pipeline:
    def __init__(self):
        self.users = []
        self.subreddits = []
        self.memes = []

    def get_users(self):
        user_set = set(self.users)
        user_generator = db.collection('Users').stream()
        for user in user_generator:
            user = User(user.id, user.to_dict())
            if user not in user_set:
                self.users.append(User(user.id, user.to_dict()))
    
    def get_subreddits(self):
        pass
    
    def get_memes(self):
        pass