import firebase from "firebase";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBS5yD-qT0Iw3zQ98RL9CjWot0Lxjn_VW4",
  authDomain: "facebook-b904a.firebaseapp.com",
  projectId: "facebook-b904a",
  storageBucket: "facebook-b904a.appspot.com",
  messagingSenderId: "131435607623",
  appId: "1:131435607623:web:58d9211a0bfb3608396362"
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
