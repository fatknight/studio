
'use server';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export async function uploadImage(file: File): Promise<string> {
    if (!file) {
        throw new Error('No file provided for upload.');
    }

    const fileExtension = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExtension}`;
    const storageRef = ref(storage, `images/${fileName}`);

    try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error: any) {
        console.error('Firebase Storage Upload Error:', error);
        // Log the specific error code and message from Firebase
        if (error.code) {
          console.error(`Error Code: ${error.code}`);
          console.error(`Error Message: ${error.message}`);
        }
        // Throw a more informative error
        throw new Error(`File upload failed: ${error.code || error.message}`);
    }
}
