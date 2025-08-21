
'use server';

import { ref, getDownloadURL, uploadString } from 'firebase/storage';
import { storage } from '@/lib/firebase';

// This function now accepts a data URI string instead of a File object.
export async function uploadImage(dataUrl: string): Promise<string> {
    if (!dataUrl || !dataUrl.startsWith('data:')) {
        // If the URL is not a data URL, assume it's either a placeholder or already a valid URL.
        // Or it could be an invalid value, in which case we let it pass and let the browser handle it.
        return dataUrl;
    }

    const fileName = `${crypto.randomUUID()}.png`;
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
