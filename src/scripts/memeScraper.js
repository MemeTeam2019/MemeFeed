const request = require('request')
const fs = require('fs')
const fetch = require("node-fetch");
const {Storage} = require('@google-cloud/storage');
const admin = require("firebase-admin");
const serviceAccount = require("memefeed-6b0e1-firebase-adminsdk-z2wdj-9eca8f2894.json");
const projectID = "memefeed-6b0e1";
const storage = new Storage({
  projectId: projectId,
});

function getJSON(sub){
	var ret;
	
	var yourUrl="https://www.reddit.com/r/"+sub+".json";

	fetch(yourUrl).then(response => {
  		return response.json();
	}).then(function(data){
  		//console.log(data.data.children);
  		var i = 5;
  		list= data.data.children
  		//for(i=0;i<list.length;i++){
  			curlist = list[i].data
  			if(curlist.domain==='i.redd.it'){
  				if(curlist.post_hint==='image'){
  					var url =curlist.url;
  					var author=curlist.author;
  					var time=curlist.created_utc;
  					var score = curlist.score;
  					upload(url,author,sub,time,score);
  			}

  			}
  		//}
	}).catch(err => {
	});
}
function print(url,author,sub,time,score){
	console.log(url);
	console.log(author);
	console.log(sub);
	console.log(time);
	console.log(score);
}
function sendToFirebase(filename,url,author,sub,time,score){
	request(url)
  	.pipe(fs.createWriteStream(filename))
     
    storage().bucket("MemeImages/").upload(filename);
	var newurl =  storage().bucket('MemeImages/').file(filename).getSignedURL();
	var dbRef = admin.firestore().collection('MemesTest').doc(filename.substring(0,filename.indexOf('.')));

	var data = {
		filename: filename,
		url: newurl,
		author: author,
		sub: sub,
		time: time,
		score: score
	};
	dbRef.set(data);
	fs.unlink(filename);
  

  //});
	

}

function upload(url,author,sub,time,score){
	var filename = url.substring(url.lastIndexOf('/')+1);
	//print(url,author,sub,time,score);
	sendToFirebase(filename,url,author,sub,time,score);

}

//admin.initializeApp({
//  credential: admin.credential.cert(serviceAccount),
//  databaseURL: "https://memefeed-6b0e1.firebaseio.com"
//});



var subreddits = ['wholesomememes',
	'BikiniBottomTwitter',
	'OneProtectRestAttack',
	'ProgrammerHumor',
	'raimimemes',
	'ScottishPeopleTwitter',
	'starterpacks',
	'trippinthroughtime',
	'me_irl',
	'AdviceAnimals',
	'nukedmemes',
	'DeepFriedMemes',
	'dankmemes',
	'dankchristianmemes',
	'OverwatchMemes',
	'2meirl4meirl',
	'Tinder']

for(i=0;i<subreddits.length;i++){
	getJSON(subreddits[i]);
}


//MemeFeed 2019 Plantano