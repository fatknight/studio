
'use server';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';

export async function uploadImage(file: File): Promise<string> {
    if (!file) {
        throw new Error('No file provided for upload.');
    }

    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const storageRef = ref(storage, `images/${fileName}`);

    try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error('Error uploading file:', error);
        // Depending on your error handling strategy, you might want to re-throw the error
        // or return a specific error message.
        throw new Error('File upload failed.');
    }
}
