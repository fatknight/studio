'use server';
/**
 * @fileOverview A flow to handle the creation of special prayer requests.
 *
 * - createRequest - A function that saves a prayer request to Firestore.
 * - CreateRequestInput - The input type for the createRequest function.
 */
import { z } from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const CreateRequestInputSchema = z.object({
  memberId: z.string().describe('The ID of the member making the request.'),
  memberName: z.string().describe('The name of the member.'),
  memberAvatarUrl: z.string().describe('The avatar URL of the member.'),
  requestDate: z.string().describe('The ISO string of the requested date.'),
  requestType: z.enum(['Orma Qurbana', 'Special Qurbana', 'Other Intercessory Prayers']).describe('The type of prayer request.'),
  otherRequest: z.string().optional().describe('The details of the prayer request if "Other" is selected.'),
});

export type CreateRequestInput = z.infer<typeof CreateRequestInputSchema>;

export async function createRequest(input: CreateRequestInput): Promise<void> {
    const requestsCollection = collection(db, 'specialRequests');
    await addDoc(requestsCollection, {
      ...input,
      createdAt: serverTimestamp(),
    });
}
