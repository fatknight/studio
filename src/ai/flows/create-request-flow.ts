'use server';
/**
 * @fileOverview A flow to handle the creation of special prayer requests.
 *
 * - createRequest - A function that saves a prayer request to Firestore.
 * - CreateRequestInput - The input type for the createRequest function.
 */
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { CreateRequestInput } from '@/lib/mock-data';


export async function createRequest(input: CreateRequestInput): Promise<void> {
    const requestsCollection = collection(db, 'specialRequests');
    await addDoc(requestsCollection, {
      ...input,
      createdAt: serverTimestamp(),
    });
}
