import { useState } from 'react';
import { useAdminStore } from '../store';
import {
    ShieldCheck,
    Smartphone,
    Key,
    Laptop,
    MapPin,
    LogOut,
    User,
    Bell,
    Lock
} from 'lucide-react';
import clsx from 'clsx';

export const SettingsPage = () => {
    const { security, toggleMfa, revokeSession } = useAdminStore();
    const [activeSection, setActiveSection] = useState<'profile' | 'security' | 'notifications'>('security');

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Settings</h1>
                    <p className="text-gray-500 mt-1">Configure your personal profile and security preferences.</p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    {[
                        { id: 'profile', icon: User, label: 'Profile' },
                        { id: 'security', icon: Lock, label: 'Security' },
                        { id: 'notifications', icon: Bell, label: 'Alerts' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveSection(tab.id as any)}
                            className={clsx(
                                "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all",
                                activeSection === tab.id
                                    ? "bg-white text-brand-600 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            <tab.icon className="h-4 w-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Summary Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 overflow-hidden">
                        <div className="flex flex-col items-center text-center">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full bg-brand-500 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-brand-100">
                                    JD
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 bg-gray-900 text-white rounded-full shadow-lg hover:bg-brand-600 transition-all">
                                    <Smartphone className="h-3 w-3" />
                                </button>
                            </div>
                            <h2 className="text-xl font-black text-gray-900 mt-4">John Dealer</h2>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Authorized Agency Head</p>
                        </div>

                        <div className="mt-8 space-y-3">
                            <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-500">ID Member</span>
                                <span className="text-xs font-black text-gray-900">#ADM-99201</span>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-500">Status</span>
                                <span className="flex items-center gap-1.5 text-[10px] font-black text-green-600 uppercase">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    Verified
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-brand-600 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                        <ShieldCheck className="absolute -right-8 -bottom-8 h-40 w-40 text-black/10 group-hover:scale-110 transition-transform duration-700" />
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Security Score</p>
                        <h3 className="text-4xl font-black mt-2">98<span className="text-brand-300">/100</span></h3>
                        <p className="text-xs mt-4 leading-relaxed opacity-80">Your account is highly secure. Enabling Biometric Unlock would reach 100%.</p>
                        <button className="mt-8 text-xs font-black uppercase tracking-widest underline underline-offset-4 hover:text-brand-200 transition-colors">Audit Report</button>
                    </div>
                </div>

                {/* Settings Details Pane */}
                <div className="lg:col-span-2 space-y-8">
                    {activeSection === 'security' && (
                        <>
                            {/* Authentication Layer */}
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
                                <div className="flex items-center gap-3 border-b pb-6">
                                    <div className="p-2.5 bg-brand-50 rounded-xl">
                                        <Key className="h-5 w-5 text-brand-600" />
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Security & Authentication</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                <Smartphone className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">Two-Factor Authentication (MFA)</p>
                                                <p className="text-xs text-gray-500 mt-0.5">Protect your account with a secondary verification code.</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={toggleMfa}
                                            className={clsx(
                                                "w-12 h-6 rounded-full transition-all relative",
                                                security.twoFactorEnabled ? "bg-brand-500" : "bg-gray-300"
                                            )}>
                                            <div className={clsx(
                                                "w-4 h-4 bg-white rounded-full absolute top-1 transition-all",
                                                security.twoFactorEnabled ? "right-1" : "left-1"
                                            )} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl opacity-50">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                <Smartphone className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">Biometric Unlock</p>
                                                <p className="text-xs text-gray-500 mt-0.5">Use FaceID or Fingerprint on supported devices.</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Coming Soon</span>
                                    </div>
                                </div>
                            </div>

                            {/* Active Sessions */}
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
                                <div className="flex items-center gap-3 border-b pb-6">
                                    <div className="p-2.5 bg-gray-50 rounded-xl">
                                        <Laptop className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Authorized Professional Devices</h3>
                                </div>

                                <div className="divide-y divide-gray-50">
                                    {security.activeSessions.map((session) => (
                                        <div key={session.id} className="py-6 flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-brand-50 transition-colors">
                                                    {session.device.includes('PC') ? <Laptop className="h-5 w-5 text-gray-400 group-hover:text-brand-500" /> : <Smartphone className="h-5 w-5 text-gray-400 group-hover:text-brand-500" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{session.device}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <MapPin className="h-3 w-3 text-gray-300" />
                                                        <span className="text-xs text-gray-400">{session.location}</span>
                                                        <span className="w-1 h-1 rounded-full bg-gray-200" />
                                                        <span className="text-[10px] font-bold text-brand-600">{session.lastActive}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => revokeSession(session.id)}
                                                className="p-2.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all border border-transparent hover:border-red-100"
                                                title="Revoke Session"
                                            >
                                                <LogOut className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
