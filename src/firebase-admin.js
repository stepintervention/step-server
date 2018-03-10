const admin = require('firebase-admin');

const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: process.env.FIREBASE_DATABASE_URL
});

console.log('Firebase Admin Initialized');

module.exports = admin;


// This registration token comes from the client FCM SDKs.
var registrationToken = "bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...";

// See the "Defining the message payload" section below for details
// on how to define a message payload.
var payload = {
	notification:{
		title:"expressjsYooooo",
		body:"Notification body",
		sound:"default",
		click_action:"FCM_PLUGIN_ACTIVITY",
		icon:"fcm_push_icon"
	}  
};

var options = {
	priority: "high"
}

//bVdHT4CZIVft8biyWxzUujllsOi1

var db = admin.database();
var ref = db.ref("profile/bVdHT4CZIVft8biyWxzUujllsOi1");
var msgsRef = ref.child("messages");
var newMsgRef = msgsRef.push();
newMsgRef.set({content:"123", uid:"bVdHT4CZIVft8biyWxzUujllsOi1"});


/*
// Send a message to the device corresponding to the provided
// registration token.
admin.messaging().sendToDevice(registrationToken, payload)
  .then(function(response) {
    // See the MessagingDevicesResponse reference documentation for
    // the contents of response.
    console.log("Successfully sent message:", response);
  })
  .catch(function(error) {
    console.log("Error sending message:", error);
  });
  */

  // The topic name can be optionally prefixed with "/topics/".
  var topic = "all";

  admin.messaging().sendToTopic(topic, payload, options)
  .then(function(response) {
    // See the MessagingTopicResponse reference documentation for the
    // contents of response.
    console.log("Successfully sent message:", response);
  })
  .catch(function(error) {
  	console.log("Error sending message:", error);
  });


  function clearDuplicateSteps(stepArray) {



  	//todo
		// and make up "zero" items
  }

  function updateAllUserStreaks() {
  	var ref = db.ref("profile");
  	var userList;
  	ref.once("value", function(snapshot) {
  		var streakArray = splitStreaks(snapshot.val().steps);
  		snapshot.forEach(function(childSnapshot) {
  			var id = childSnapshot.key;
  			var childData = childSnapshot.val();
  			var stepArray = childData.steps;
  			var clearedStepArray = clearDuplicateSteps(stepArray);
  			db.ref("profile/" + id + "/steps").set(clearedStepArray); // not sure

  			var streakArray = splitStreaks(clearedStepArray);
  			db.ref("profile/" + id + "/streaks").set(streakArray); // !!!! change to reservation of old data. not sure
  		});
  	}, function(error) {
  		console.log("error!: " + error.code);
  	});
  }


  function updateAllUserClusters() {
  	var ref = db.ref("profile");
  	var userList;
  	ref.once("value", function(snapshot) {
  		snapshot.forEach(function(childSnapshot) {
  			var id = childSnapshot.key;
  			var childData = childSnapshot.val();
  			var stepArray = childData.steps;
  			var userCluster = getUserCluster(stepArray);
  			db.ref("profile/" + id + "/cluster").set(userCluster); // !!!! change to reservation of old data. not sure
  		}
  }

function findSameUserCluster(cluster) {
	var ref = db.ref("profile");
  	var userList = [];
  	ref.once("value", function(snapshot) {
  		snapshot.forEach(function(childSnapshot) {
  			var id = childSnapshot.key;
  			var childData = childSnapshot.val();
  			var userCluster = childData[childData.length - 1];
  			if (isSameUserCluster (cluster, userCluster)) {
  				userList.append(childSnapshot);
  			}
  		}
  	}
  	return userList;
}

function calculateAverage() {

}

function getPercentile() {
	
}

/*
function clearDuplicateSteps(stepArray) {

}
*/

function isSameUserCluster(a, b) {
	return a==b;
}

// change para
function getUserCluster(stepArray) {
	return 2;
}

 // change para
 function getStreakCluster(stepArray) {
 	return 18;
 }

  // perform streak splitting every day
  function splitStreaks(stepArray) {
  	var reversedArray = stepArray.reverse();
  	var streakArray = [];
  	var startIndex = 0;
  	var endIndex = 0;
  	var isPrevContinuous = false;

  	reversedArray.forEach(function(step, index) {
  		
  		// summarize a streak (10)
  		if ((step < 500 && isPrevContinuous) || (step >= 500 && index == reversedArray.length - 1)) {
  			// start / end of the streak
  			var startMonth = reversedArray[endIndex-1].month;
  			var startDate = reversedArray[endIndex-1].date;
  			var endMonth = reversedArray[startIndex].month;
  			var endDate = reversedArray[startIndex].date;

  			var streakSteps = reversedArray.slice(startIndex, endIndex + 1);
  			var reversedStreakSteps = streakSteps.reverse();
  			var streakCluster = getStreakCluster(reversedStreakSteps);

  			streakArray.append({
				// date (extract from original object)
				startMonth: startMonth,
				startDate : startDate,
				endMonth : endMonth,
				endDate : endDate,
				startIndex : startIndex,
				endIndex : endIndex,
				streakCluster : streakCluster
			});
  			startIndex = endIndex;
  		}


  		if (step < 500) {
  			isPrevContinuous = false;
  		} else {
  			isPrevContinuous = true;
  		}
  		endIndex++;

  	})；

  	return streakArray;

  	//update the array to server (firebase)
  }