// ==========================================================================================
// !! IMPORTANT !!
// YOUR APP WILL NOT WORK UNTIL YOU COMPLETE THE STEPS BELOW.
//
// This file is trying to connect to Firebase, but it's using placeholder
// values. You need to replace them with the actual configuration from your
// Firebase project.
//
// HOW TO FIX THIS:
// 1. Go to the Firebase Console: https://console.firebase.google.com/
// 2. Open your project.
// 3. Go to "Project settings" (click the gear icon ⚙️).
// 4. In the "General" tab, scroll down to the "Your apps" section.
// 5. Click on your web app (or create one if you haven't).
// 6. Find the `firebaseConfig` object and copy its values.
// 7. Paste the values into the `firebaseConfig` object below, replacing the "TODO: ..." placeholders.
// ==========================================================================================

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

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
