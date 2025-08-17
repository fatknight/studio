'use server';

import { collection, doc, getDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Member, SpecialRequest } from '@/lib/mock-data';

export async function getMembers(): Promise<Member[]> {
  const membersCol = collection(db, 'members');
  const memberSnapshot = await getDocs(membersCol);
  const memberList = memberSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));
  return memberList;
}

export async function getMemberById(id: string): Promise<Member | null> {
  const docRef = doc(db, 'members', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Member;
  } else {
    return null;
  }
}

export async function getMemberByPhone(phone: string): Promise<Member | null> {
  const q = query(collection(db, 'members'), where('phone', '==', phone));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as Member;
  }
  return null;
}

export async function getSpecialRequests(): Promise<SpecialRequest[]> {
  const requestsCol = collection(db, 'specialRequests');
  const q = query(requestsCol, orderBy('requestDate', 'asc'));
  const requestSnapshot = await getDocs(q);
  const requestList = requestSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SpecialRequest));
  return requestList;
}

    