from db import db

class Subreddit:
    def __init__(self, sub_id, data={}):
        try:
            self.sub_id = sub_id

