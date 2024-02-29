// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { getAuth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCBz3v_7D8jhZDTHbdj3WX3ZIQtbYKYUmQ",
  authDomain: "apimoviesdb.firebaseapp.com",
  databaseURL: "https://apimoviesdb-default-rtdb.firebaseio.com",
  projectId: "apimoviesdb",
  storageBucket: "apimoviesdb.appspot.com",
  messagingSenderId: "645356762414",
  appId: "1:645356762414:web:7ddc0b081c8445796576bf",
  measurementId: "G-Z1L2CM3PV6"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getDatabase(firebaseApp);

