'use server';

import { collection, doc, getDoc, getDocs, query, where, orderBy, Timestamp, addDoc, updateDoc, deleteDoc, QueryConstraint, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Member, SpecialRequest, FamilyMember } from '@/lib/mock-data';

export async function getMembers(filters?: { zone?: string; ward?: string; subgroup?: string; }): Promise<Member[]> {
  const membersCol = collection(db, 'members');
  const constraints: QueryConstraint[] = [];

  if (filters?.zone && filters.zone !== 'all') {
    constraints.push(where('zone', '==', filters.zone));
  }
  if (filters?.ward && filters.ward !== 'all') {
    constraints.push(where('ward', '==', filters.ward));
  }
  if (filters?.subgroup && filters.subgroup !== 'all') {
    constraints.push(where('subGroups', 'array-contains', filters.subgroup));
  }
  
  const q = query(membersCol, ...constraints);
  const memberSnapshot = await getDocs(q);
  const memberList = memberSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));
  return memberList;
}

export async function getMemberById(id: string): Promise<Member | null> {
  if (id === 'new') return null;
  const docRef = doc(db, 'members', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const memberData = docSnap.data() as Member;
    // Important: Do not return the password hash
    delete memberData.password;
    return { id: docSnap.id, ...memberData };
  } else {
    return null;
  }
}

export async function getMemberByPhone(phone: string): Promise<Member | null> {
  const q = query(collection(db, 'members'), where('phone', '==', phone));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];
    const memberData = docSnap.data() as Member;
    // Important: Do not return the password hash
    delete memberData.password;
    return { id: docSnap.id, ...memberData };
  }
  return null;
}

export async function authenticateMember(phone: string, password_DO_NOT_USE: string): Promise<Member | null> {
  const q = query(collection(db, "members"), where("phone", "==", phone));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const memberDoc = querySnapshot.docs[0];
  const memberData = memberDoc.data() as Member;

  // WARNING: This is a temporary, insecure password check.
  // In a real application, you MUST use a secure, hashed password system.
  if (memberData.password === password_DO_NOT_USE) {
    // On successful authentication, return the member object without the password.
    const { password, ...memberInfo } = memberData;
    return { id: memberDoc.id, ...memberInfo };
  }

  return null;
}

export async function getSpecialRequests(): Promise<SpecialRequest[]> {
  const requestsCol = collection(db, 'specialRequests');
  const q = query(requestsCol, orderBy('requestDate', 'asc'));
  const requestSnapshot = await getDocs(q);
  const requestList = requestSnapshot.docs.map(doc => {
      const data = doc.data();
      // Convert Firestore Timestamp to string
      const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : new Date().toISOString();
      return {
          id: doc.id,
          ...data,
          createdAt,
      } as SpecialRequest
  });
  return requestList;
}


export async function createMember(memberData: Omit<Member, 'id'>): Promise<string> {
    // Check for an existing member with the same phone number to avoid duplicates
    const existingMemberQuery = query(collection(db, 'members'), where('phone', '==', memberData.phone));
    const existingMemberSnapshot = await getDocs(existingMemberQuery);
    if (!existingMemberSnapshot.empty) {
        throw new Error(`Member with phone number ${memberData.phone} already exists.`);
    }

    const docRef = await addDoc(collection(db, 'members'), memberData);
    return docRef.id;
}

export async function updateMember(id: string, memberData: Partial<Member>): Promise<void> {
    const memberRef = doc(db, 'members', id);
    await updateDoc(memberRef, memberData);
}

export async function deleteMember(id: string): Promise<void> {
    const memberRef = doc(db, 'members', id);
    await deleteDoc(memberRef);
}