import firebase from "firebase";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBa86PIaLQ1tTJV7TI7EmIsR23iCTuCoAQ",
  authDomain: "facebook-3dbd2.firebaseapp.com",
  projectId: "facebook-3dbd2",
  storageBucket: "facebook-3dbd2.appspot.com",
  messagingSenderId: "457204050262",
  appId: "1:457204050262:web:99d3d5e7b0fe30de9acef7"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}else {
  firebase.app(); 
}


const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();
const firestore = firebase.firestore();

export { db, storage, auth, firestore };
