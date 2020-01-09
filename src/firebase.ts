import * as firebase from 'firebase/app';
import "firebase/firestore";

firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "animals-8726d.firebaseapp.com",
  projectId: "animals-8726d",
});

export const db = firebase.firestore();
export const animalsDatabase = db.collection('animals');
