const request = require('request');
const UUID = require('uuid-v4');
const fs = require('fs');
const fetch = require('node-fetch');
const { Storage } = require('@google-cloud/storage');
const admin = require('firebase-admin');
const serviceAccount = 'memefeed-6b0e1-firebase-adminsdk-z2wdj-9eca8f2894.json';
const projectID = 'memefeed-6b0e1';
const path = require('path');
const os = require('os');
const storage = new Storage({
  projectId: projectID,
  keyFilename: serviceAccount,
});
let uuid = UUID();

function getfile(url, filename) {
  request(url)
    .pipe(fs.createWriteStream(filename))
    .on('close', function() {
      console.log('all good! ' + filename);
    });
}
function deletefile(filename) {
  fs.unlink(filename, function(err) {
    if (err) throw err;
    // if no error, file has been deleted successfully
    console.log('File deleted! ' + filename);
  });
}
function getJSON(sub) {
  var ret;

  var yourUrl = 'https://www.reddit.com/r/' + sub + '.json';

  fetch(yourUrl)
    .then((response) => {
      return response.json();
    })
    .then(function(data) {
      //console.log(data.data.children);
      var i;
      list = data.data.children;
      for (i = 0; i < 5; i++) {
        curlist = list[i].data;
        if (curlist.domain === 'i.redd.it') {
          if (curlist.post_hint === 'image') {
            var url = curlist.url;
            var author = curlist.author;
            var time = curlist.created_utc;
            var score = curlist.score;
            var caption = curlist.title;
            upload(url, author, sub, time, score, caption);
          }
        }
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}

function print(url, author, sub, time, score, filename, caption) {
  console.log(url);
  console.log(author);
  console.log(sub);
  console.log(time);
  console.log(score);
  console.log(filename);
  console.log(caption);
}

function sendToFirebase(filename, url, author, sub, time, score, caption) {
  var dbRef = admin
    .firestore()
    .collection('MemesTest')
    .doc(filename.substring(0, filename.indexOf('.')));
  var s = storage.bucket('gs://memefeed-6b0e1.appspot.com');
  var sfile = s.file('meme_images/' + filename);
  console.log(path.resolve(filename));
  request(url)
    .pipe(
      sfile.createWriteStream({
        destination: 'meme_images/' + filename,
        uploadType: 'media',
        metadata: {
          contentType: 'image/' + filename.substring(filename.indexOf('.') + 1),
          metadata: {
            firebaseStorageDownloadTokens: uuid,
          },
        },
      })
    )
    .on('finish', function() {
      console.log('all good! ' + filename);
    });

  var url =
    'https://firebasestorage.googleapis.com/v0/b/' +
    s.name +
    '/o/' +
    encodeURIComponent(sfile.name) +
    '?alt=media&token=' +
    uuid;

  print(url, author, sub, time, score, filename, caption);

  var data = {
    filename: filename,
    url: url,
    author: author,
    sub: sub,
    time: time,
    score: score,
    reacts: 0,
    caption: caption,
    numFlags: 0,
  };
  console.log('push ok');
  dbRef.set(data);
}

async function upload(url, author, sub, time, score, caption) {
  var filename = url.substring(url.lastIndexOf('/') + 1);
  sendToFirebase(filename, url, author, sub, time, score, caption);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

var subreddits = [
  'wholesomememes',
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
  'gaywashedmemes',
];

for (i = 0; i < subreddits.length; i++) {
  getJSON(subreddits[i]);
}

//MemeFeed 2019 Jesuisouef
