import { useState } from 'react';
import { useUserStore } from '../store';
import {
    Users,
    UserPlus,
    Trash2,
    ShieldCheck,
    Mail,
    Plus,
    X,
    CheckCircle2,
    Clock,
    MoreVertical
} from 'lucide-react';
import clsx from 'clsx';
import { ROLES } from '../../../core/config';
import type { UserRole } from '../../../core/config';
import type { Permission } from '../types';

export const UsersPage = () => {
    const { users, seats, inviteUser, removeUser, purchaseSeats } = useUserStore();
    const [isInviting, setIsInviting] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [newName, setNewName] = useState('');
    const [newRole, setNewRole] = useState<UserRole>(ROLES.SALES);
    const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);

    const ALL_PERMISSIONS: { id: Permission, label: string }[] = [
        { id: 'quotes_view', label: 'View Quotes' },
        { id: 'quotes_manage', label: 'Manage Quotes' },
        { id: 'orders_view', label: 'View Orders' },
        { id: 'orders_manage', label: 'Manage Orders' },
        { id: 'inventory_view', label: 'View Inventory' },
        { id: 'finance_view', label: 'View Financials' },
    ];

    const togglePermission = (p: Permission) => {
        setSelectedPermissions(prev =>
            prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
        );
    };

    const handleInvite = () => {
        if (!newEmail || !newName) return;
        inviteUser(newEmail, newName, newRole, selectedPermissions);
        setNewEmail('');
        setNewName('');
        setIsInviting(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <Users className="h-8 w-8 text-brand-500" />
                        Team Management
                    </h1>
                    <p className="text-gray-500 mt-1 uppercase text-[10px] font-black tracking-widest">Enterprise Organization Controls</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Seats Used</p>
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-black text-gray-900">{seats.used}/{seats.total}</span>
                            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={clsx(
                                        "h-full transition-all",
                                        (seats.used / seats.total) > 0.8 ? "bg-orange-500" : "bg-brand-500"
                                    )}
                                    style={{ width: `${(seats.used / seats.total) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => purchaseSeats(1)}
                        className="p-2.5 bg-gray-900 text-white rounded-xl hover:bg-brand-600 transition-all shadow-lg active:scale-95"
                        title="Add Seat"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b flex justify-between items-center">
                    <h3 className="font-black text-gray-900 uppercase tracking-tight text-lg">Sub-Users & Subscriptions</h3>
                    <button
                        onClick={() => setIsInviting(true)}
                        className="bg-brand-500 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-600 transition-all flex items-center gap-2 shadow-lg shadow-brand-100"
                    >
                        <UserPlus className="h-4 w-4" />
                        Invite Member
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b">
                            <tr>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Member</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Permissions</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.map((user) => (
                                <tr key={user.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 font-black">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{user.name}</p>
                                                <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-500">
                                                    <Mail className="h-3 w-3" />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={clsx(
                                            "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border",
                                            user.role === ROLES.OWNER ? "bg-brand-50 text-brand-700 border-brand-100" : "bg-gray-50 text-gray-600 border-gray-100"
                                        )}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                                            {user.permissions.slice(0, 2).map(p => (
                                                <span key={p} className="text-[8px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded uppercase">
                                                    {p.split('_')[0]}
                                                </span>
                                            ))}
                                            {user.permissions.length > 2 && (
                                                <span className="text-[8px] font-bold text-brand-400 bg-brand-50 px-1.5 py-0.5 rounded">
                                                    +{user.permissions.length - 2}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            {user.status === 'active' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                                            {user.status === 'invited' && <Clock className="h-4 w-4 text-orange-400" />}
                                            <span className={clsx(
                                                "text-[10px] font-bold uppercase",
                                                user.status === 'active' ? "text-gray-900" : "text-gray-400"
                                            )}>
                                                {user.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        {user.role !== ROLES.OWNER && (
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => removeUser(user.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-all">
                                                    <MoreVertical className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invite Modal */}
            {isInviting && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] p-10 max-w-2xl w-full shadow-2xl space-y-8 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Expand Your Team</h3>
                                <p className="text-gray-500 mt-1">Assign roles and fine-grained module permissions.</p>
                            </div>
                            <button onClick={() => setIsInviting(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X className="h-6 w-6 text-gray-400" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Enter member name"
                                    className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-brand-500 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Work Email</label>
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="email@dealer.com"
                                    className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-brand-500 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Primary Role</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[ROLES.SALES, ROLES.OPS, ROLES.FINANCE].map(r => (
                                    <button
                                        key={r}
                                        onClick={() => setNewRole(r)}
                                        className={clsx(
                                            "py-4 rounded-2xl border font-bold capitalize transition-all",
                                            newRole === r ? "bg-gray-900 border-gray-900 text-white shadow-xl" : "bg-white border-gray-100 text-gray-500 hover:border-brand-300"
                                        )}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Module Permissions</label>
                            <div className="grid grid-cols-2 gap-3">
                                {ALL_PERMISSIONS.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => togglePermission(p.id)}
                                        className={clsx(
                                            "flex items-center justify-between p-4 rounded-2xl border transition-all",
                                            selectedPermissions.includes(p.id) ? "bg-brand-50 border-brand-200 text-brand-900" : "bg-white border-gray-100 text-gray-500"
                                        )}
                                    >
                                        <span className="text-xs font-bold">{p.label}</span>
                                        {selectedPermissions.includes(p.id) ? <ShieldCheck className="h-4 w-4 text-brand-600" /> : <div className="h-4 w-4 rounded-full border border-gray-200" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 border-t">
                            <button
                                onClick={() => setIsInviting(false)}
                                className="flex-1 py-4 font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest text-xs"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleInvite}
                                className="flex-2 bg-brand-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-brand-100 hover:bg-brand-600 transition-all active:scale-95"
                            >
                                Send Invitation
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
