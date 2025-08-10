// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// =================================================================================
// IMPORTANT: Your app will not work without this configuration.
//
// You must replace the placeholder values below with your app's actual
// Firebase project configuration. You can find this in the Firebase console:
//
// 1. Go to your Firebase project.
// 2. Click the gear icon > Project settings.
// 3. In the "General" tab, scroll down to the "Your apps" section.
// 4. Select your web app and find the configuration object.
// 5. Copy and paste the values here.
//
// See: https://firebase.google.com/docs/web/learn-more#config-object
// =================================================================================
const firebaseConfig = {
  apiKey: "TODO: Add your API key",
  authDomain: "TODO: Add your auth domain",
  projectId: "TODO: Add your project ID",
  storageBucket: "TODO: Add your storage bucket",
  messagingSenderId: "TODO: Add your messaging sender ID",
  appId: "TODO: Add your app ID"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
