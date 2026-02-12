import { create } from 'zustand';
import type { UserRole } from '../../core/config';

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: {
        id: '1',
        name: 'Test Owner',
        email: 'owner@example.com',
        role: 'owner'
    }, // Temporary default user for testing RBAC without login flow
    isAuthenticated: true,
    login: (user, token) => {
        localStorage.setItem('auth_token', token);
        set({ user, isAuthenticated: true });
    },
    logout: () => {
        localStorage.removeItem('auth_token');
        set({ user: null, isAuthenticated: false });
    },
}));
