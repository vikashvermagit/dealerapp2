// --- Audit Logs ---
export type AuditAction = 'login' | 'quote_created' | 'order_delivered' | 'wallet_topup' | 'settings_changed' | 'security_alert' | 'user_invitation';

export interface AuditLogItem {
    id: string;
    action: AuditAction;
    performedBy: string;
    ipAddress: string;
    timestamp: string;
    metadata: Record<string, any>;
}

// --- Support & Disputes ---
export type TicketStatus = 'open' | 'pending' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export interface SupportTicket {
    id: string;
    subject: string;
    status: TicketStatus;
    priority: TicketPriority;
    slaDeadline: string; // ISO string 
    createdAt: string;
    lastUpdate: string;
}

// --- Settings & Security ---
export interface SecuritySettings {
    twoFactorEnabled: boolean;
    biometricLogin: boolean;
    activeSessions: Array<{
        id: string;
        device: string;
        location: string;
        lastActive: string;
    }>;
}

export interface AdminStore {
    auditLogs: AuditLogItem[];
    tickets: SupportTicket[];
    security: SecuritySettings;
    addTicket: (subject: string, priority: TicketPriority) => void;
    updateTicket: (id: string, status: TicketStatus) => void;
    toggleMfa: () => void;
    revokeSession: (id: string) => void;
}
