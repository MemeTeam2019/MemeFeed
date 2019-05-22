from db import db
from collections import Counter

class User:
    def __init__(self, uid, data):
        try:
            self.uid = uid
            self.memes = {}
            self.top_1_subreddit = ''
            self.top_2_subreddit = ''
            self.top_3_subreddit = ''
            self.bottom_1_subreddit = ''
            self.bottom_2_subreddit = ''
            self.bottom_3_subreddit = ''
            self.top_1_user = ''
            self.top_2_user = ''
            self.top_3_user = ''
            self.avg_rank = 0

            self.rank_subreddits()
            self.rank_users()
            self.get_reacts()
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
            meme_data = db.collection('Memes').document(react.id).get().to_dict()
            react_data = react.to_dict()
            rank = react_data.get('rank')
            likedFrom = meme_data['sub']
            if likedFrom != '':
                if likedFrom not in subreddit_counter:
                    react_data['likedFrom'] = 0
                if rank >= 2:
                    subreddit_counter[likedFrom] += rank
                else:
                    subreddit_counter[likedFrom] += rank - 4

        # this is fucking disgusting
        top_subreddits = subreddit_counter.most_common(len(subreddit_counter))
        if len(top_subreddits) >= 1:
            self.top_1_subreddit = top_subreddits[0][0]
        if len(top_subreddits) >= 2:
            self.top_2_subreddit = top_subreddits[1][0]
        if len(top_subreddits) >= 3:
            self.top_3_subreddit = top_subreddits[2][0]
        if len(top_subreddits) >= 4:
            self.bottom_1_subreddit = top_subreddits[-1][0]
        if len(top_subreddits) >= 5:
            self.bottom_2_subreddit = top_subreddits[-2][0]
        if len(top_subreddits) >= 6:
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
            if likedFrom not in subreddits:
                if likedFrom not in user_counter:
                    react_data['likedFrom'] = 0
                if rank >= 2:
                    user_counter[likedFrom] += rank
                else:
                    user_counter[likedFrom] += rank - 4

        top_users = user_counter.most_common(len(user_counter))
        if len(top_users) >= 1:
            self.top_1_user = top_users[0][0]
        if len(top_users) >= 2:
            self.top_2_user = top_users[1][0]
        if len(top_users) >= 3:
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

    def get_reacts(self):
        memes = db.collection(f'Reacts/{self.uid}/Likes').stream()
        for meme in memes:
            self.memes[meme.id] = meme.to_dict()

    # Calculate the average rank this user has given
    def average_ranking(self):
        sum_of_ranks = 0
        number_of_ranks = 0
        reacts = db \
            .collection('Reacts') \
            .document(self.uid) \
            .collection('Likes') \
            .stream()
        for react in reacts:
            react_data = react.to_dict()
            rank = react_data['rank']
            sum_of_ranks += rank
            number_of_ranks += 1

        self.avg_rank = sum_of_ranks/number_of_ranks

    def recent_subreddits(self):
        pass


subreddits = set(['wholesomememes',
                 'BikiniBottomTwitter',
                 'OneProtectRestAttack',
                 'ProgrammerHumor',
                 'raimimemes',
                 'ScottishPeopleTwitter',
                 'starterpacks',
                 'trippinthroughtime',
                 'me_irl',
                 'dank memes',
                 'AdviceAnimals',
                 'nukedmemes',
                 'DeepFriedMemes',
                 'dank_memes',
                 'dankchrisitanmemes',
                 'OverwatchMemes',
                 '2meirl4meirl',
                 'Tinder',
                 'rickandmorty',
                 'IncrediblesMemes',
                 'wholesomememes',
                 'AnimalMemes',
                  'Insanepeoplefacebook',
                  'kermitmemes',
                  'csmemes',
                  'TrashAndKpop',
                  'HarryPotterMemes',
                  'DisneyMemes',
                  'MildlyVandalized',
                  'WTF',
                  'toosoon',
                  'marvelmemes',
                  'starwarsmemes',
                  'tvmemes',
                  'anime_irl',
                  'SoftwareGore',
                  'Crappydesign',
                  'Bikememes',
                  'Hmmm',
                  'Vaxxhappened',
                  'GymMemes',
                  'veganmemes',
                  'Sciencememes',
                  'Shrek',
                  'Brogres',
                  'MedMeme',
                  'MLMemes',
                  'NUMTOT',
                  'Terriblefacebookmemes',
                  'Shittyfacebookmemes',
                  'FacebookCringe',
                  'Tumblr',
                  'Bestoftwitter',
                  'BlackPeopleTwitter',
                 'WhitePeopleTwitter',
                 'Drugmemes',
                 'Indianpeoplefacebook',
                 'Doggomemes',
                 'nathanwpyle',
                 'Threateningtoilets',
                 'Physicsmemes',
                 'Engineeringmemes',
                 'gaywashedmemes'])


users = db.collection('Users').stream()
for user in users:
    u = User(user.id, user.to_dict())
    break
