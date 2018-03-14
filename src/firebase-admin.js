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
  			//db.ref("profile/" + id + "/finalized-steps").set(clearedStepArray);

  			var streakArray = splitStreaks(clearedStepArray);
  			db.ref("profile/" + id + "/streaks").push(streakArray); // !!!! change to reservation of old data. not sure
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
  			db.ref("profile/" + id + "/cluster").push(userCluster); // !!!! change to reservation of old data. not sure
  		}
  }

function findSameUserCluster(cluster) {
	var ref = db.ref("profile");
  	var userList = [];
  	ref.once("value", function(snapshot) {
  		snapshot.forEach(function(childSnapshot) {
  			var id = childSnapshot.key;
  			var childData = childSnapshot.val();
  			var userClusters = childData.cluster;
  			var recentCluster = userCluster[userClusters.length - 1];
  			if (isSameUserCluster (cluster, recentCluster)) {
  				userList.push(childSnapshot);
  			}
  		}
  	}
  	return userList;
}

function findSameStreakCluster(clutser) {
	var ref = db.ref("profile");
  	var streakList = [];
  	ref.once("value", function(snapshot) {
  		snapshot.forEach(function(childSnapshot) {
  			var id = childSnapshot.key;
  			var childData = childSnapshot.val();
  			var streakCluster = childData.streaks;
  			var recentClusters = streakCluster[streakCluster.length - 1];
  			var stepArray = childData.steps;
  			var reversedArray = stepArray.reverse();
  			recentClusters.forEach(function(streak) {
  				if (streak.streakCluster == cluster) {
  					// extract the step data
  					var startIndex = streak.startIndex;
  					var endIndex = streak.endIndex;
  					var streakSteps = reversedArray.slice(startIndex, endIndex + 1);
  					// get all streaks of the same cluster
  					streakList.push(streakSteps);
  				}
  			});
  		}
  	}
  	return streakList;
}

// same period, all average
function calculateUserClusterAverage(clusterID, length) {
	var users = findSameUserCluster(clusterID);
	var steps = [];
	users.forEach(function(user) {
		var singleUserSteps = steps.slice(steps.length - length, steps.length);
		steps.push(singleUserSteps);
	});

	var dailyAverage = [];
	for (i=0; i<length; i++) {
		var total = 0;
		steps.forEach(function(user) {
			total += user[i];
	});
		dailyAverage[i] = total / length;
	}
	
	return dailyAverage;
}

function getStepPercentile(userID, userList, length) {
	var stepsList;
	userList.forEach(function(user) {
		var singleUserSteps = steps.slice(steps.length - length, steps.length);
		var singleUserSum = 0;
		singleUserSteps.forEach(function(steps) {
			singleUserSum += steps;
		})
		stepsList.push({uid: user.key, sum: singleUserSum}); // not sure
	});

	var orderIndex = 0;
	stepsList.sort(compare);
	stepsList.forEach(function(steps, index) {
		if (userID == steps.uid) {
			orderIndex = index;
			break;
		}
	});

	console.log("user index: " + orderIndex);

	return orderIndex/(userList.length);
}

function compare(a,b) {
  if (a.sum< b.sum) {
    return -1;
  }
  if (a.sum > b.sum) {
    return 1;
  }
  return 0;
}

function getStreakPercentile(streakID, streakArray) {
	// cluster all streaks
	var clusterArray = [];
	var orderIndex = 0;
	var orderedStreakArray = streakArray.sort(compareStreak);
	streakArray.forEach(function(streak, index) {
		if (streak.streakCluster == streakID) {
			orderIndex = index;
			break;
		}
	});

	console.log("streak index: " + orderIndex);

	return orderIndex/(streakArray.length);
}

function compareStreak(a,b) {
  if (a.streakCluster< b.streakCluster) {
    return -1;
  }
  if (a.streakCluster > b.streakCluster) {
    return 1;
  }
  return 0;
}

function extractStreakData(startIndex, endIndex, array) {
	var reversedArray = array.reverse();
	var streakSteps = reversedArray.slice(startIndex, endIndex + 1);
	var reversedStreakSteps = streakSteps.reverse();
	return reversedStreakSteps;
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

  			// earlier is front
  			streakArray.push({
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