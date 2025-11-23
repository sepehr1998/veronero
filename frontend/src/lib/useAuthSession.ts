'use client';

import { useCallback } from 'react';
import { fetchAuthSession } from '@/lib/auth';
import { useUserStore } from '@/stores/user';

export function useAuthSession() {
    const setUser = useUserStore((state) => state.setUser);
    const clearUser = useUserStore((state) => state.clearUser);
    const setSessionLoading = useUserStore((state) => state.setSessionLoading);

    const syncSession = useCallback(async () => {
        setSessionLoading(true);
        try {
            const session = await fetchAuthSession();

            if (session.isAuthenticated && session.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email,
                    fullName: session.user.fullName,
                    locale: session.user.locale,
                    lastLoginAt: session.user.lastLoginAt,
                });
                console.log('[auth] Logged in user', session.user);
            } else {
                clearUser();
            }
        } catch (error) {
            console.error('[auth] Failed to sync session', error);
            clearUser();
        } finally {
            setSessionLoading(false);
        }
    }, [setSessionLoading, setUser, clearUser]);

    return { syncSession };
}
