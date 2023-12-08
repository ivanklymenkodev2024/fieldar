// Import the functions you need from the SDKs you need
import firebase, { initializeApp } from "firebase/app";
import 'firebase/database';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXtrHV3cbcuos7Xudm4hJYFN1iZ0Ea-WU",
  authDomain: "bim-ar-cb18a.firebaseapp.com",
  databaseURL: "https://bim-ar-cb18a-default-rtdb.firebaseio.com",
  projectId: "bim-ar-cb18a",
  storageBucket: "bim-ar-cb18a.appspot.com",
  messagingSenderId: "70278650598",
  appId: "1:70278650598:web:63c9d3ed51cd0ef68f3927",
  measurementId: "G-X6VZ2HWG8F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;