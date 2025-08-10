import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { members } from './mock-data';
// You need to download your service account key from the Firebase console
// and save it as serviceAccountKey.json in your project root.
// MAKE SURE to add serviceAccountKey.json to your .gitignore file
// to prevent it from being checked into source control.
import serviceAccount from '../../serviceAccountKey.json';

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function seedDatabase() {
  const membersCollection = db.collection('members');
  console.log('Starting to seed database...');

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
