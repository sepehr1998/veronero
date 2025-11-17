'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/user';

export default function DashboardAuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/authentication'); // redirect to login
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return null; // prevents flashing dashboard content before redirect
    }

    return <>{children}</>;
}
