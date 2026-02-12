import type { UserRole } from '../../../core/config';

export type Permission =
    | 'quotes_view' | 'quotes_manage'
    | 'orders_view' | 'orders_manage'
    | 'finance_view' | 'finance_manage'
    | 'inventory_view' | 'inventory_manage'
    | 'admin_access'
    | 'user_invitation';

export interface UserPermissions {
    modules: Permission[];
}

export interface OrganizationUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: 'active' | 'deactivated' | 'invited';
    permissions: Permission[];
    joinedAt: string;
    lastActive?: string;
}

export interface SeatInfo {
    used: number;
    total: number;
    costPerExtraSeat: number;
}

export interface UserManagementStore {
    users: OrganizationUser[];
    seats: SeatInfo;
    inviteUser: (email: string, name: string, role: UserRole, permissions: Permission[]) => void;
    updateUserStatus: (userId: string, status: 'active' | 'deactivated') => void;
    removeUser: (userId: string) => void;
    purchaseSeats: (count: number) => void;
    updatePermissions: (userId: string, permissions: Permission[]) => void;
}
