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
  // TODO: Replace this with your API key from the Firebase console.
  apiKey: "TODO: Add your API key",
  // TODO: Replace this with your auth domain from the Firebase console.
  authDomain: "TODO: Add your auth domain",
  // TODO: Replace this with your project ID from the Firebase console.
  projectId: "TODO: Add your project ID",
  // TODO: Replace this with your storage bucket from the Firebase console.
  storageBucket: "TODO: Add your storage bucket",
  // TODO: Replace this with your messaging sender ID from the Firebase console.
  messagingSenderId: "TODO: Add your messaging sender ID",
  // TODO: Replace this with your app ID from the Firebase console.
  appId: "TODO: Add your app ID",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
