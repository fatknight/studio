'use client';

import { useAuthStore } from '@/hooks/use-auth';
import React from 'react';

export const AdminControls = ({ children }: { children: React.ReactNode }) => {
    const { member } = useAuthStore();

    if (member?.role === 'Admin') {
        return <>{children}</>;
    }

    return null;
};
