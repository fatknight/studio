import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { members } from './mock-data';
// You need to download your service account key from the Firebase console
// and save it as serviceAccountKey.json in your project root.
// MAKE SURE to add serviceAccountKey.json to your .gitignore file
// to prevent it from being checked into source control.
import serviceAccount from '../../serviceAccountKey.json';

try {
  initializeApp({
    credential: cert(serviceAccount)
  });
} catch (error: any) {
  if (error.code === 'app/duplicate-app') {
    console.log('Firebase Admin already initialized.');
  } else {
    console.error('Firebase Admin initialization error:', error);
    process.exit(1);
  }
}

const db = getFirestore();

async function seedDatabase() {
  console.log(`Starting to seed database for project: ${process.env.GCP_PROJECT || (serviceAccount as any).project_id}...`);
  
  try {
    // A simple check to see if we can communicate with Firestore.
    // This will fail if the database does not exist.
    await db.collection('__check').doc('__check').get();
    console.log('Successfully connected to Firestore.');
  } catch (error) {
    console.error('\nError connecting to Firestore.', error);
    console.error('\nPlease make sure that you have created a Firestore database in your Firebase project.');
    console.error('You can do this from the Firebase console: "Firestore Database" -> "Create database".');
    process.exit(1);
  }

  const membersCollection = db.collection('members');
  console.log('Starting to seed members...');

  for (const member of members) {
    try {
      // Use member.id as the document ID
      await membersCollection.doc(member.id).set(member);
      console.log(`Added member: ${member.name}`);
    } catch (error) {
      console.error(`Error adding member ${member.name}: `, error);
    }
  }

  console.log('Database seeding completed.');
}

seedDatabase();
