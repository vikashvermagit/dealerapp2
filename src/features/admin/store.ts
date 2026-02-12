import { create } from 'zustand';
import type { AdminStore, SupportTicket, AuditLogItem } from './types';

const MOCK_AUDIT_LOGS: AuditLogItem[] = [
    {
        id: 'log-1',
        action: 'login',
        performedBy: 'John Dealer',
        ipAddress: '192.168.1.45',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        metadata: { browser: 'Chrome', os: 'Windows' }
    },
    {
        id: 'log-2',
        action: 'settings_changed',
        performedBy: 'John Dealer',
        ipAddress: '192.168.1.45',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        metadata: { setting: 'notification_preferences', value: 'email_only' }
    }
];

const MOCK_TICKETS: SupportTicket[] = [
    {
        id: 'TKT-7782',
        subject: 'Delayed verification of payment receipt',
        status: 'open',
        priority: 'high',
        slaDeadline: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(), // 4 hours left
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
        lastUpdate: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
        id: 'TKT-8901',
        subject: 'Incorrect wallet balance after top-up',
        status: 'pending',
        priority: 'critical',
        slaDeadline: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // SLA Breached!
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        lastUpdate: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    }
];

export const useAdminStore = create<AdminStore>((set, get) => ({
    auditLogs: MOCK_AUDIT_LOGS,
    tickets: MOCK_TICKETS,
    security: {
        twoFactorEnabled: true,
        biometricLogin: false,
        activeSessions: [
            { id: 'sess-1', device: 'Windows PC • Chrome', location: 'Mumbai, IN', lastActive: 'Active Now' },
            { id: 'sess-2', device: 'iOS App • v2.4.0', location: 'Delhi, IN', lastActive: '2 days ago' }
        ]
    },

    addTicket: (subject, priority) => {
        const newTicket: SupportTicket = {
            id: `TKT-${Math.floor(Math.random() * 10000)}`,
            subject,
            priority,
            status: 'open',
            slaDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
            createdAt: new Date().toISOString(),
            lastUpdate: new Date().toISOString()
        };
        set({ tickets: [newTicket, ...get().tickets] });
    },

    updateTicket: (id, status) => set(state => ({
        tickets: state.tickets.map(t => t.id === id ? { ...t, status, lastUpdate: new Date().toISOString() } : t)
    })),

    toggleMfa: () => set(state => ({
        security: { ...state.security, twoFactorEnabled: !state.security.twoFactorEnabled }
    })),

    revokeSession: (id) => set(state => ({
        security: {
            ...state.security,
            activeSessions: state.security.activeSessions.filter(s => s.id !== id)
        }
    }))
}));
