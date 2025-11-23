import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
    id: string;
    email: string;
    fullName?: string | null;
    locale?: string | null;
    lastLoginAt?: string | null;
};

type UserState = {
    user: User | null;
    setUser: (user: User | null) => void;
    clearUser: () => void;
    isAuthenticated: boolean;
    isSessionLoading: boolean;
    setSessionLoading: (value: boolean) => void;
};

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isSessionLoading: true,
            setUser: (user) => set({ user, isAuthenticated: !!user }),
            clearUser: () => set({ user: null, isAuthenticated: false }),
            setSessionLoading: (value) => set({ isSessionLoading: value }),
        }),
        {
            name: 'user-storage', // key for localStorage
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
);
