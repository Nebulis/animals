import * as firebase from "firebase/app";
import "firebase/firestore";
import { Country } from "./world/type";

firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "animals-8726d.firebaseapp.com",
  projectId: "animals-8726d"
});

export interface Animal {
  id: string;
  name: string;
  countries: Country[];
  clazz: string;
  family: string;
}

export const db = firebase.firestore();
export const animalsDatabase = db.collection("animals");
