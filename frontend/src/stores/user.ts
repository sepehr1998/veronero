import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
    id: string;
    name: string;
    email: string;
    token?: string; // optional JWT or session token
};

type UserState = {
    user: User | null;
    setUser: (user: User | null) => void;
    clearUser: () => void;
    isAuthenticated: boolean;
};

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            setUser: (user) => set({ user, isAuthenticated: !!user }),
            clearUser: () => set({ user: null, isAuthenticated: false }),
        }),
        {
            name: 'user-storage', // key for localStorage
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
);
