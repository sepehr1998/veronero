'use client';

import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAccountStore } from '@/stores/account';

const envAccountId = process.env.NEXT_PUBLIC_ACCOUNT_ID;

export function useActiveAccount() {
    const searchParams = useSearchParams();
    const accountId = useAccountStore((state) => state.accountId);
    const setAccountId = useAccountStore((state) => state.setAccountId);

    useEffect(() => {
        const fromQuery = searchParams.get('accountId');
        if (fromQuery && fromQuery !== accountId) {
            setAccountId(fromQuery);
        }
    }, [searchParams, accountId, setAccountId]);

    const resolvedAccountId = useMemo(() => {
        if (accountId && accountId.trim().length > 0) {
            return accountId;
        }
        if (envAccountId && envAccountId.trim().length > 0) {
            return envAccountId;
        }
        return null;
    }, [accountId]);

    return { accountId: resolvedAccountId, setAccountId };
}
