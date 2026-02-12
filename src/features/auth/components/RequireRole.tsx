import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import type { UserRole } from '../../../core/config';

interface RequireRoleProps {
    children: React.ReactNode;
    roles: UserRole[];
}

export const RequireRole = ({ children, roles }: RequireRoleProps) => {
    const { user } = useAuthStore();

    if (!user || !roles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};
