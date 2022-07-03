// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCltYP0gXwdEV3MK_dbXDKz4dDg4CdPckw",
  authDomain: "todo-list-b88b9.firebaseapp.com",
  databaseURL: "https://todo-list-b88b9-default-rtdb.firebaseio.com",
  projectId: "todo-list-b88b9",
  storageBucket: "todo-list-b88b9.appspot.com",
  messagingSenderId: "497774881647",
  appId: "1:497774881647:web:1d05a3fd106b488d60969a"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
export const auth=getAuth();