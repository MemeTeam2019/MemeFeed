import firebase_admin
from firebase_admin import credentials, firestore

# Authenticate via Admin SDK
# Download admin_secret from Firebase console
admin_secret = '/Users/miaaltieri/MemeFeed/src/recommender/data/memefeed-6b0e1-firebase-adminsdk-z2wdj-8f0b0d9ad9.json'
cred = credentials.Certificate(admin_secret)
firebase_admin.initialize_app(cred)

# Init firestore client
db = firestore.client()
