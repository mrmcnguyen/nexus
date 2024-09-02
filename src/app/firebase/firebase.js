// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkoQ77uXwKOhsrWtlYYQI9NbNIXhL2cF0",
  authDomain: "nexus-91ba6.firebaseapp.com",
  projectId: "nexus-91ba6",
  storageBucket: "nexus-91ba6.appspot.com",
  messagingSenderId: "442467847629",
  appId: "1:442467847629:web:990ea84a25b9df32900884",
  measurementId: "G-X33J82F6DY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {auth}