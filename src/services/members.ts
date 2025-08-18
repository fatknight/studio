
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

export async function batchUpdateMembers(data: any[]): Promise<{ success: boolean; message: string }> {
    const batch = writeBatch(db);
    const membersCollection = collection(db, 'members');

    // Group data by familyId
    const families: Record<string, any[]> = data.reduce((acc, person) => {
        const familyId = person.familyId || person.name; // Use name as fallback for single members
        if (!acc[familyId]) {
            acc[familyId] = [];
        }
        acc[familyId].push(person);
        return acc;
    }, {});

    for (const familyId in families) {
        const familyMembers = families[familyId];
        const head = familyMembers.find(p => p.relation.toLowerCase() === 'head' || familyMembers.length === 1);

        if (!head) {
            console.warn(`Skipping family ${familyId}: No 'Head' of family found.`);
            continue;
        }
        
        // Find existing member by familyId to get the document ID
        const q = query(membersCollection, where('familyId', '==', familyId));
        const querySnapshot = await getDocs(q);

        const family: FamilyMember[] = familyMembers
            .filter(p => p !== head)
            .map(p => ({
                name: p.name || '',
                relation: p.relation,
                status: p.status || 'Active',
                birthday: p.birthday || undefined,
                phone: p.phone || undefined,
                avatarUrl: p.avatarUrl || 'https://placehold.co/128x128.png',
                subGroups: p.subGroups ? p.subGroups.split(',').map((s: string) => s.trim()) : [],
                maritalStatus: p.maritalStatus || 'Single',
                weddingDay: p.weddingDay || undefined,
            }));

        const memberData = {
            name: head.name,
            email: head.email,
            phone: head.phone,
            password: head.password || 'password123', // Default password
            address: head.address,
            status: head.status || 'Active',
            homeParish: head.homeParish,
            nativeDistrict: head.nativeDistrict,
            birthday: head.birthday || undefined,
            maritalStatus: head.maritalStatus || 'Single',
            weddingDay: head.weddingDay || undefined,
            familyName: head.familyName,
            familyId: head.familyId,
            familyPhotoUrl: head.familyPhotoUrl || undefined,
            subGroups: head.subGroups ? head.subGroups.split(',').map((s: string) => s.trim()) : [],
            avatarUrl: head.avatarUrl || 'https://placehold.co/128x128.png',
            zone: head.zone,
            ward: head.ward,
            role: head.role || 'Member',
            family: family,
            joinDate: new Date().toISOString(), // Use current date for joinDate
        };
        
        if (!querySnapshot.empty) {
            // Update existing member
            const docRef = querySnapshot.docs[0].ref;
            batch.update(docRef, memberData);
        } else {
            // Create new member
            const docRef = doc(membersCollection); // Create a new doc with a generated ID
            batch.set(docRef, memberData);
        }
    }

    try {
        await batch.commit();
        return { success: true, message: 'Members uploaded successfully!' };
    } catch (error: any) {
        console.error("Batch update failed: ", error);
        return { success: false, message: `An error occurred: ${error.message}` };
    }
}

    