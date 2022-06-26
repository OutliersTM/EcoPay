import * as firebase from "firebase/app";
import "firebase/messaging";
import "firebase/auth";
import "firebase/functions";

const config = {
  apiKey: "AIzaSyBXagrD84VXx8OyHe7p1qrBfu_y5v1cql8",
  authDomain: "ecopaymlr.firebaseapp.com",
  projectId: "ecopaymlr",
  storageBucket: "ecopaymlr.appspot.com",
  messagingSenderId: "362519129536",
  appId: "1:362519129536:web:e085b88dbca315ff7aac25",
  measurementId: "G-LKVWK42PLC",
};
firebase.initializeApp(config);

if ("Notification" in window) {
  const messaging = firebase.messaging();
  messaging.usePublicVapidKey("G-LKVWK42PLC");

  messaging.onMessage((payload) => {
    console.log("Message received. ", payload);
    // push message to UI
  });

  messaging.onTokenRefresh(() => {
    const db = firebase.firestore();
    messaging
      .getToken()
      .then((refreshedToken) => {
        db.collection("users")
          .doc(firebase.auth().currentUser.uid)
          .update({ pushTokenWeb: refreshedToken })
          .then(() => {
            console.log("Token updated.");
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log("Unable to retrieve refreshed token ", err);
      });
  });
}

export default firebase;
