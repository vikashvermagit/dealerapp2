import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store';
import { SIDEBAR_NAVIGATION, type NavItem } from '../../core/config/navigation';
import clsx from 'clsx';

export const Sidebar = () => {
    const { user } = useAuthStore();

    if (!user) return null;

    const renderNavItem = (item: NavItem) => {
        // Check Permission
        if (!item.roles.includes(user.role)) return null;

        return (
            <div key={item.path} className="mb-1">
                <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                        clsx(
                            "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                            isActive
                                ? "bg-gray-900 text-white"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        )
                    }
                >
                    {item.icon && <item.icon className="mr-3 h-5 w-5" />}
                    {item.title}
                </NavLink>
                {/* Simple nesting support - expandable logic can be added later */}
                {item.children && (
                    <div className="ml-4 mt-1 border-l border-gray-700 pl-4">
                        {item.children.map(renderNavItem)}
                    </div>
                )}
            </div>
        );
    };

    return (
        <aside className="w-64 bg-gray-950 text-white flex flex-col h-full border-r border-gray-900">
            <div className="flex h-16 items-center px-6 border-b border-gray-900">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                    DealerPanel
                </span>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {SIDEBAR_NAVIGATION.map(renderNavItem)}
            </div>

            <div className="p-4 border-t border-gray-900">
                <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                        {user.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};
