export type InvitationStatus = 'pending' | 'joined' | 'declined' | 'expired';

export interface Invitation {
    id: string;
    customerName: string;
    vehicleModel: string;
    year: number;
    budget: string;
    expiresAt: string; // ISO string
    status: InvitationStatus;
    declineReason?: string;
    stockConsentCompleted?: boolean;
}

export interface InvitationStore {
    invitations: Invitation[];
    credits: number;
    isLoading: boolean;
    setInvitations: (invitations: Invitation[]) => void;
    joinInvitation: (id: string) => void;
    declineInvitation: (id: string, reason: string) => void;
    completeStockConsent: (id: string) => void;
    burnCredit: () => void;
}
