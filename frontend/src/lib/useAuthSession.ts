'use client';

import { useCallback } from 'react';
import { fetchAuthSession } from '@/lib/auth';
import { useUserStore } from '@/stores/user';
import { useAccountStore } from '@/stores/account';

export function useAuthSession() {
    const setUser = useUserStore((state) => state.setUser);
    const clearUser = useUserStore((state) => state.clearUser);
    const setSessionLoading = useUserStore((state) => state.setSessionLoading);
    const setAccountId = useAccountStore((state) => state.setAccountId);
    const currentAccountId = useAccountStore((state) => state.accountId);

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

                // Auto-pick a valid account if we don't already have one, or if the stored one is not in the session payload
                const fallbackAccountId =
                    session.defaultAccountId ||
                    session.accounts?.[0]?.accountId ||
                    null;
                const hasStoredAccount =
                    !!currentAccountId &&
                    (session.accounts ?? []).some(
                        (a) => a.accountId === currentAccountId,
                    );
                if (!hasStoredAccount && fallbackAccountId) {
                    setAccountId(fallbackAccountId);
                }
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
    }, [setSessionLoading, setUser, clearUser, currentAccountId, setAccountId]);

    return { syncSession };
}
