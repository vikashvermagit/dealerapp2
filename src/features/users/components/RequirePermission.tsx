import type { ReactNode } from 'react';
import { useUserStore } from '../store';
import { useAuthStore } from '../../auth/store';
import type { Permission } from '../types';

interface RequirePermissionProps {
    children: ReactNode;
    permission: Permission;
    fallback?: ReactNode;
}

export const RequirePermission = ({ children, permission, fallback }: RequirePermissionProps) => {
    const { users } = useUserStore();
    const { user } = useAuthStore();

    if (!user) return null;

    // Find user in the organization management store to get their permissions
    // Note: authStore only has ID/name/email/role. Permissions are stored in UserStore.
    const organizationUser = users.find(u => u.email === user.email);

    const hasPermission = organizationUser?.permissions.includes(permission);

    if (!hasPermission) {
        return <>{fallback || null}</>;
    }

    return <>{children}</>;
};
