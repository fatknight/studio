import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Member } from '@/lib/mock-data';

interface AuthState {
  member: Member | null;
  setMember: (member: Member | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      member: null,
      setMember: (member) => set({ member }),
    }),
    {
      name: 'auth-storage', // name of the item in storage
      storage: createJSONStorage(() => sessionStorage), // use sessionStorage
    }
  )
);
