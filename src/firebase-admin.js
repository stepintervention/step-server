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