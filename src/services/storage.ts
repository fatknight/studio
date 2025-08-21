
'use server';

import { ref, getDownloadURL, uploadString } from 'firebase/storage';
import { storage } from '@/lib/firebase';

// This function now accepts a data URI string instead of a File object.
export async function uploadImage(dataUrl: string): Promise<string> {
    if (!dataUrl) {
        throw new Error('No file data provided for upload.');
    }

    const fileName = `${crypto.randomUUID()}.png`; // Assume png, or parse from dataUrl if needed
    const storageRef = ref(storage, `images/${fileName}`);

    try {
        // Upload the file from the data URL.
        const snapshot = await uploadString(storageRef, dataUrl, 'data_url');
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error: any) {
        console.error('Firebase Storage Upload Error:', error);
        if (error.code) {
          console.error(`Error Code: ${error.code}`);
          console.error(`Error Message: ${error.message}`);
          console.error("Full Error Object:", JSON.stringify(error, null, 2));
        }
        throw new Error(`File upload failed: ${error.code || error.message}`);
    }
}
