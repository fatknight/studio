
'use server';

import { ref, getDownloadURL, uploadString } from 'firebase/storage';
import { getStorage as getAdminStorage } from 'firebase-admin/storage';
import { storage } from '@/lib/firebase';
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';

// This is a temporary workaround to get the service account credentials.
// In a real production environment, you should use environment variables
// or another secure method to manage your service account key.
import serviceAccount from '../../serviceAccountKey.json';

const adminApp = !getApps().length
  ? initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    })
  : getApps()[0];


export async function getSecureUrl(filePath: string): Promise<string> {
    if (!filePath || !filePath.startsWith('images/')) {
        // Return placeholder or non-storage URLs directly
        return filePath;
    }
    
    try {
        const adminStorage = getAdminStorage(adminApp);
        const fileRef = adminStorage.bucket().file(filePath);
        
        const [url] = await fileRef.getSignedUrl({
            action: 'read',
            expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        });
        
        return url;
    } catch (error: any) {
        console.error('Error generating signed URL:', error);
        // Return a placeholder or a generic error image URL
        return 'https://placehold.co/128x128.png?text=Error';
    }
}


// This function now accepts a data URI string instead of a File object.
export async function uploadImage(dataUrl: string, name?: string): Promise<string> {
    if (!dataUrl || !dataUrl.startsWith('data:')) {
        // If the URL is not a data URL, assume it's either a placeholder or already a valid URL.
        // Or it could be an invalid value, in which case we let it pass and let the browser handle it.
        return dataUrl;
    }

    const extension = dataUrl.substring(dataUrl.indexOf('/') + 1, dataUrl.indexOf(';'));
    const fileName = `images/${name || crypto.randomUUID()}.${extension || 'png'}`;
    const storageRef = ref(storage, fileName);

    try {
        // Upload the file from the data URL.
        const snapshot = await uploadString(storageRef, dataUrl, 'data_url');
        // Return the file path, not the download URL
        return snapshot.ref.fullPath;
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
