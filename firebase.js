import firebase from "firebase";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyByxkUKEjtYKmDCCQNkt6fT2-bPYtgHq_o",
  authDomain: "facebook-7f532.firebaseapp.com",
  projectId: "facebook-7f532",
  storageBucket: "facebook-7f532.appspot.com",
  messagingSenderId: "350341872149",
  appId: "1:350341872149:web:644f7258897dade8a6ac1c",
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
