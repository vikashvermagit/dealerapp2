import { create } from 'zustand';
import type { UserManagementStore, OrganizationUser } from './types';
import { useAdminStore } from '../admin/store';
import { useFinanceStore } from '../finance/store';
import { ROLES } from '../../core/config';

const MOCK_USERS: OrganizationUser[] = [
    {
        id: 'u-1',
        name: 'Test Owner',
        email: 'owner@example.com',
        role: ROLES.OWNER,
        status: 'active',
        permissions: ['quotes_view', 'quotes_manage', 'orders_view', 'orders_manage', 'finance_view', 'finance_manage', 'inventory_view', 'inventory_manage', 'admin_access', 'user_invitation'],
        joinedAt: '2023-01-01T00:00:00Z',
    },
    {
        id: 'u-2',
        name: 'Sarah Sales',
        email: 'sarah@dealer.com',
        role: ROLES.SALES,
        status: 'active',
        permissions: ['quotes_view', 'quotes_manage', 'orders_view'],
        joinedAt: '2023-06-15T12:30:00Z',
    },
    {
        id: 'u-3',
        name: 'Mike Ops',
        email: 'mike@dealer.com',
        role: ROLES.OPS,
        status: 'active',
        permissions: ['orders_view', 'orders_manage', 'inventory_view'],
        joinedAt: '2023-08-20T09:45:00Z',
    }
];

export const useUserStore = create<UserManagementStore>((set, get) => ({
    users: MOCK_USERS,
    seats: {
        used: 3,
        total: 5,
        costPerExtraSeat: 49
    },

    inviteUser: (email, name, role, permissions) => {
        const { used, total } = get().seats;
        if (used >= total) {
            alert("Seat limit reached. Please purchase more seats.");
            return;
        }

        const newUser: OrganizationUser = {
            id: `u-${Math.floor(Math.random() * 10000)}`,
            name,
            email,
            role,
            status: 'invited',
            permissions,
            joinedAt: new Date().toISOString(),
        };

        set(state => ({
            users: [...state.users, newUser],
            seats: { ...state.seats, used: state.seats.used + 1 }
        }));

        // Audit Log
        useAdminStore.getState().auditLogs = [
            {
                id: `audit-${Date.now()}`,
                action: 'user_invitation',
                performedBy: 'Test Owner (Owner)',
                ipAddress: '192.168.1.1',
                timestamp: new Date().toISOString(),
                metadata: { invitedEmail: email, role }
            },
            ...useAdminStore.getState().auditLogs
        ];
    },

    updateUserStatus: (userId, status) => set(state => {
        const user = state.users.find(u => u.id === userId);
        if (user?.role === ROLES.OWNER) return state;

        useAdminStore.getState().auditLogs = [
            {
                id: `audit-${Date.now()}`,
                action: 'settings_changed',
                performedBy: 'Test Owner (Owner)',
                ipAddress: '192.168.1.1',
                timestamp: new Date().toISOString(),
                metadata: { userId, status }
            },
            ...useAdminStore.getState().auditLogs
        ];

        return {
            users: state.users.map(u => u.id === userId ? { ...u, status } : u)
        };
    }),

    removeUser: (userId) => set(state => {
        const user = state.users.find(u => u.id === userId);
        if (user?.role === ROLES.OWNER) return state;

        useAdminStore.getState().auditLogs = [
            {
                id: `audit-${Date.now()}`,
                action: 'settings_changed',
                performedBy: 'Test Owner (Owner)',
                ipAddress: '192.168.1.1',
                timestamp: new Date().toISOString(),
                metadata: { userId, action: 'removed' }
            },
            ...useAdminStore.getState().auditLogs
        ];

        return {
            users: state.users.filter(u => u.id !== userId),
            seats: { ...state.seats, used: state.seats.used - 1 }
        };
    }),

    purchaseSeats: (count) => {
        const { seats } = get();
        const totalCost = count * seats.costPerExtraSeat;
        const financeStore = useFinanceStore.getState();

        if (financeStore.balance < totalCost) {
            alert("Insufficient funds to increase seat capacity.");
            return;
        }

        financeStore.addTransaction(
            'addon_purchase',
            -totalCost,
            `Scaling: Added ${count} team seats`
        );

        useAdminStore.getState().auditLogs = [
            {
                id: `audit-${Date.now()}`,
                action: 'wallet_topup',
                performedBy: 'Test Owner (Owner)',
                ipAddress: '192.168.1.1',
                timestamp: new Date().toISOString(),
                metadata: { action: 'purchase_seats', count, cost: totalCost }
            },
            ...useAdminStore.getState().auditLogs
        ];

        set(state => ({
            seats: { ...state.seats, total: state.seats.total + count }
        }));
    },

    updatePermissions: (userId, permissions) => set(state => {
        useAdminStore.getState().auditLogs = [
            {
                id: `audit-${Date.now()}`,
                action: 'settings_changed',
                performedBy: 'Test Owner (Owner)',
                ipAddress: '192.168.1.1',
                timestamp: new Date().toISOString(),
                metadata: { userId, action: 'permissions_updated', newPermissions: permissions }
            },
            ...useAdminStore.getState().auditLogs
        ];

        return {
            users: state.users.map(u => u.id === userId ? { ...u, permissions } : u)
        };
    })
}));
