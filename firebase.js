import firebase from "firebase";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCjZFZp1UkQYUvbFwnJYOG1f9UwTKNXqUM",
  authDomain: "facebook-4d9e2.firebaseapp.com",
  projectId: "facebook-4d9e2",
  storageBucket: "facebook-4d9e2.appspot.com",
  messagingSenderId: "785923486353",
  appId: "1:785923486353:web:8643b7f0d7977f915ec530",
  measurementId: "G-NXNK0KKC0X"
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
