'use client';

import { useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useUserStore } from '@/stores/user';
import { buildAuthLoginUrl } from '@/lib/auth';

export default function DashboardAuthGuard({ children }: { children: ReactNode }) {
    const { isAuthenticated, isSessionLoading } = useUserStore();
    const loginUrl = useMemo(() => {
        if (typeof window === 'undefined') {
            return buildAuthLoginUrl('/dashboard');
        }
        return buildAuthLoginUrl(`${window.location.origin}/dashboard`);
    }, []);

    useEffect(() => {
        if (!isSessionLoading && !isAuthenticated) {
            window.location.href = loginUrl;
        }
    }, [isAuthenticated, isSessionLoading, loginUrl]);

    if (!isAuthenticated) {
        return isSessionLoading ? (
            <div className="flex h-screen w-full items-center justify-center text-sm text-gray-500">
                Checking your session...
            </div>
        ) : null;
    }

    return <>{children}</>;
}
