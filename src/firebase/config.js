import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2N63uAVXRt2ZkTaimYx8BB0cjZZ9QN74",
  authDomain: "sales-tracker-a4c71.firebaseapp.com",
  projectId: "sales-tracker-a4c71",
  storageBucket: "sales-tracker-a4c71.appspot.com",
  messagingSenderId: "1058629363909",
  appId: "1:1058629363909:web:8da80c6c1903f9902a28ac",
  measurementId: "G-CKL8S8WN46",
};

//init firebase
firebase.initializeApp(firebaseConfig);

//init services
const projectFireStore = firebase.firestore();
const projectAuth = firebase.auth();
const timestamp = firebase.firestore.Timestamp;

export { projectFireStore, projectAuth, timestamp };
