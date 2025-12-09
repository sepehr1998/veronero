import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AccountState = {
    accountId: string | null;
    setAccountId: (accountId: string | null) => void;
    clearAccountId: () => void;
};

export const useAccountStore = create<AccountState>()(
    persist(
        (set) => ({
            accountId: null,
            setAccountId: (accountId) => set({ accountId }),
            clearAccountId: () => set({ accountId: null }),
        }),
        {
            name: 'account-storage',
        },
    ),
);
