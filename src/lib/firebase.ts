
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAXyI-rMJ2FJiVZfdibxYZfM7PenFHLcpY",
  authDomain: "verity-directory.firebaseapp.com",
  projectId: "verity-directory",
  storageBucket: "verity-directory.appspot.com",
  messagingSenderId: "389378794700",
  appId: "1:389378794700:web:3d036b3cea58c6f9e48e69"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };

