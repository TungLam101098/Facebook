import firebase from "firebase";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAWkxckVmIZ5-v3jOzmmcBh5QXkdY6Cc9o",
  authDomain: "facebook-4df57.firebaseapp.com",
  projectId: "facebook-4df57",
  storageBucket: "facebook-4df57.appspot.com",
  messagingSenderId: "804694035407",
  appId: "1:804694035407:web:c8cbe720cb28e9454a20ba"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}
export const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();
const firestore = firebase.firestore();

export { db, storage, auth, firestore };
