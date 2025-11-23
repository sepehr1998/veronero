'use client';

import { useEffect } from 'react';
import { useAuthSession } from '@/lib/useAuthSession';

export default function AuthSessionSync() {
    const { syncSession } = useAuthSession();

    useEffect(() => {
        void syncSession();
    }, [syncSession]);

    return null;
}
