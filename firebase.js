import firebase from "firebase";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDjzmved3MHalBykJRPM8sEc7pdj2aiYOw",
  authDomain: "facebook-a64ed.firebaseapp.com",
  projectId: "facebook-a64ed",
  storageBucket: "facebook-a64ed.appspot.com",
  messagingSenderId: "34595029144",
  appId: "1:34595029144:web:2c20fe37e8bebe7c0f50ed",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();
const firestore = firebase.firestore();

export { db, storage, auth, firestore };
