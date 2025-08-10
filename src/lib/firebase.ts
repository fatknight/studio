// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyAXyI-rMJ2FJiVZfdibxYZfM7PenFHLcpY",
  authDomain: "verity-directory.firebaseapp.com",
  projectId: "verity-directory",
  storageBucket: "verity-directory.firebasestorage.app",
  messagingSenderId: "389378794700",
  appId: "1:389378794700:web:3d036b3cea58c6f9e48e69"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
