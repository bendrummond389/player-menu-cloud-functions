const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.newUserSignup = functions.auth.user().onCreate((user) => {
  return admin.firestore().collection("users").doc(user.uid).set({
    colors: ["none", "none", "none", "none"],
  });
});

exports.userDeleted = functions.auth.user().onDelete((user) => {
  const doc = admin.firestore().collection("users").doc(user.uid);
  return doc.delete();
});

exports.updatePlayerColor = functions.https.onCall((data, context) => {
  const index = data.index;
  const color = data.color;
  const user = admin.firestore().collection("users").doc(context.auth.uid);
  user.get().then((doc) => {
    const newArray = doc.data().colors;
    newArray[index] = color;
    return user.update({
      colors: newArray,
    });
  });
});

exports.getPlayerColor = functions.https.onCall(async (data, context) => {
  const index = data.index;
  const user = admin.firestore().collection("users").doc(context.auth.uid);
  const doc = await user.get();
  const newArray = doc.data().colors;
  return newArray[index];
});
