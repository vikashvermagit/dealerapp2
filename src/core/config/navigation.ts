import React from 'react';
import {
    LayoutDashboard,
    Mail,
    MessageSquare,
    FileText,
    ShoppingCart,
    Car,
    CreditCard,
    PieChart,
    BarChart3,
    Users,
    Headphones,
    ShieldCheck,
    Settings
} from 'lucide-react';
import { ROLES } from './index';
import type { UserRole } from './index';

export interface NavItem {
    title: string;
    path: string;
    icon?: React.ComponentType<{ className?: string }>;
    roles: UserRole[]; // Allowed roles
    children?: NavItem[];
}

const ALL_ROLES: UserRole[] = [ROLES.OWNER, ROLES.ADMIN, ROLES.SALES, ROLES.FINANCE, ROLES.OPS];

export const SIDEBAR_NAVIGATION: NavItem[] = [
    {
        title: 'Dashboard',
        path: '/dashboard',
        icon: LayoutDashboard,
        roles: ALL_ROLES,
    },
    {
        title: 'Invitations',
        path: '/invitations',
        icon: Mail,
        roles: [ROLES.OWNER, ROLES.ADMIN, ROLES.SALES],
    },
    {
        title: 'Active Rooms',
        path: '/active-rooms',
        icon: MessageSquare,
        roles: [ROLES.OWNER, ROLES.ADMIN, ROLES.SALES],
    },
    {
        title: 'Quotes',
        path: '/quotes',
        icon: FileText,
        roles: [ROLES.OWNER, ROLES.SALES, ROLES.FINANCE],
    },
    {
        title: 'Orders',
        path: '/orders',
        icon: ShoppingCart,
        roles: [ROLES.OWNER, ROLES.SALES, ROLES.OPS],
    },
    {
        title: 'Stock & VIN',
        path: '/stock',
        icon: Car,
        roles: [ROLES.OWNER, ROLES.SALES, ROLES.OPS],
    },
    {
        title: 'Billing & Wallet',
        path: '/billing',
        icon: CreditCard,
        roles: [ROLES.OWNER, ROLES.FINANCE],
    },
    {
        title: 'Financials',
        path: '/financials',
        icon: PieChart,
        roles: [ROLES.OWNER, ROLES.FINANCE],
    },
    {
        title: 'Reports & Analytics',
        path: '/analytics',
        icon: BarChart3,
        roles: [ROLES.OWNER, ROLES.ADMIN],
    },
    {
        title: 'Users & Roles',
        path: '/users',
        icon: Users,
        roles: [ROLES.OWNER, ROLES.ADMIN],
    },
    {
        title: 'Support & Disputes',
        path: '/support',
        icon: Headphones,
        roles: ALL_ROLES,
    },
    {
        title: 'Audit & Security',
        path: '/audit',
        icon: ShieldCheck,
        roles: [ROLES.OWNER, ROLES.ADMIN],
    },
    {
        title: 'Settings',
        path: '/settings',
        icon: Settings,
        roles: ALL_ROLES,
    },
];
