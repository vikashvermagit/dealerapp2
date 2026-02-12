import { create } from 'zustand';
import type { Invitation } from './types';

interface InvitationState {
    invitations: Invitation[];
    credits: number;
    isLoading: boolean;
    setInvitations: (invitations: Invitation[]) => void;
    joinInvitation: (id: string) => void;
    declineInvitation: (id: string, reason: string) => void;
    completeStockConsent: (id: string) => void;
    burnCredit: () => void;
}

// Mock initial data
const INITIAL_INVITATIONS: Invitation[] = [
    {
        id: 'inv-1',
        customerName: 'John Doe',
        vehicleModel: 'Toyota Camry',
        year: 2024,
        budget: '$35,000 - $40,000',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(), // 2 hours from now
        status: 'joined',
    },
    {
        id: 'inv-2',
        customerName: 'Alice Smith',
        vehicleModel: 'Tesla Model 3',
        year: 2023,
        budget: '$45,000 - $50,000',
        expiresAt: new Date(Date.now() + 1000 * 60 * 45).toISOString(), // 45 mins from now
        status: 'joined',
    },
    {
        id: 'inv-3',
        customerName: 'Bob Johnson',
        vehicleModel: 'Ford F-150',
        year: 2024,
        budget: '$55,000 - $65,000',
        expiresAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // Expired 10 mins ago
        status: 'joined', // Set to joined for testing breach
    }
];

export const useInvitationStore = create<InvitationState>((set) => ({
    invitations: INITIAL_INVITATIONS,
    credits: 10, // Starting balance
    isLoading: false,

    setInvitations: (invitations) => set({ invitations }),

    joinInvitation: (id) => set((state) => {
        const inv = state.invitations.find(i => i.id === id);
        if (!inv || inv.status !== 'pending' || state.credits <= 0) return state;

        return {
            credits: state.credits - 1,
            invitations: state.invitations.map(i =>
                i.id === id ? { ...i, status: 'joined' } : i
            )
        };
    }),

    declineInvitation: (id, reason) => set((state) => ({
        invitations: state.invitations.map(i =>
            i.id === id ? { ...i, status: 'declined', declineReason: reason } : i
        )
    })),

    completeStockConsent: (id) => set((state) => ({
        invitations: state.invitations.map(i =>
            i.id === id ? { ...i, stockConsentCompleted: true } : i
        )
    })),

    burnCredit: () => set((state) => ({ credits: Math.max(0, state.credits - 1) })),
}));
