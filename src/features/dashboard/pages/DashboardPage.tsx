import {
    TrendingUp,
    FileText,
    ShoppingCart,
    Users,
    ArrowUpRight,
    Wallet,
    Clock,
    ShieldAlert,
    ChevronRight,
    Plus
} from 'lucide-react';
import { useQuoteStore } from '../../quotes/store';
import { useOrderStore } from '../../orders/store';
import { useFinanceStore } from '../../finance/store';
import { useUserStore } from '../../users/store';
import { useAdminStore } from '../../admin/store';
import { useAuthStore } from '../../auth/store';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

export const DashboardPage = () => {
    const { user } = useAuthStore();
    const { quotes } = useQuoteStore();
    const { orders } = useOrderStore();
    const { balance, subscription } = useFinanceStore();
    const { users, seats } = useUserStore();
    const { auditLogs, tickets } = useAdminStore();

    const stats = [
        {
            label: 'Open Quotes',
            value: quotes.filter(q => q.status === 'draft').length,
            icon: FileText,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            to: '/quotes'
        },
        {
            label: 'Pending Orders',
            value: orders.filter(o => o.status !== 'delivered').length,
            icon: ShoppingCart,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            to: '/orders'
        },
        {
            label: 'Team Size',
            value: users.length,
            icon: Users,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            to: '/users'
        },
        {
            label: 'Wallet Balance',
            value: `$${balance.toLocaleString()}`,
            icon: Wallet,
            color: 'text-brand-600',
            bg: 'bg-brand-50',
            to: '/billing'
        },
    ];

    const recentActivity = auditLogs.slice(0, 5);
    const slaBreaches = tickets.filter(t => new Date(t.slaDeadline) < new Date() && t.status !== 'resolved');

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                        Welcome back, {user?.name.split(' ')[0]}
                    </h1>
                    <p className="text-gray-500 mt-1 uppercase text-[10px] font-black tracking-widest">Enterprise Command Center • {subscription.plan} Plan</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        to="/quotes"
                        className="bg-white border border-gray-100 p-3 rounded-2xl shadow-sm hover:border-brand-500 transition-all group"
                    >
                        <Plus className="h-5 w-5 text-gray-400 group-hover:text-brand-500" />
                    </Link>
                    <Link
                        to="/analytics"
                        className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-brand-600 transition-all shadow-xl active:scale-95"
                    >
                        View Reports
                        <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <Link
                        key={idx}
                        to={stat.to}
                        className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-brand-300 transition-all"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={clsx("p-3 rounded-2xl transition-colors", stat.bg, stat.color)}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                            <div className="p-2 bg-gray-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                                <ChevronRight className="h-3 w-3 text-gray-400" />
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-2xl font-black text-gray-900 mt-1">{stat.value}</h3>

                        {/* Decorative background element */}
                        <div className={clsx("absolute -right-4 -bottom-4 h-16 w-16 opacity-5 group-hover:scale-110 transition-transform", stat.color)}>
                            <stat.icon className="h-full w-full" />
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b flex justify-between items-center bg-gray-50/30">
                            <h3 className="font-black text-gray-900 uppercase tracking-tight text-lg flex items-center gap-3">
                                <Clock className="h-5 w-5 text-brand-500" />
                                Operational Pulse
                            </h3>
                            <Link to="/audit" className="text-[10px] font-black text-brand-600 uppercase tracking-widest hover:underline">View History</Link>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {recentActivity.map((log) => (
                                <div key={log.id} className="p-6 flex items-center justify-between group hover:bg-gray-50/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                                            {log.action === 'login' && <Users className="h-4 w-4" />}
                                            {log.action === 'quote_created' && <FileText className="h-4 w-4" />}
                                            {log.action === 'order_delivered' && <ShoppingCart className="h-4 w-4" />}
                                            {log.action === 'security_alert' && <ShieldAlert className="h-4 w-4 text-red-500" />}
                                            {(!['login', 'quote_created', 'order_delivered', 'security_alert'].includes(log.action)) && <TrendingUp className="h-4 w-4" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">
                                                {log.action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                By <span className="font-semibold text-gray-700">{log.performedBy}</span> • {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest group-hover:text-brand-500 transition-colors">
                                        {new Date(log.timestamp).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Alerts & Scaling */}
                <div className="space-y-6">
                    {/* SLA Alert */}
                    {slaBreaches.length > 0 && (
                        <div className="bg-red-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-red-200">
                            <ShieldAlert className="absolute -right-6 -bottom-6 h-24 w-24 text-white/10" />
                            <h4 className="font-black uppercase tracking-tight text-lg relative z-10">Attention Required</h4>
                            <p className="text-red-100 text-xs mt-2 relative z-10 leading-relaxed font-medium">
                                You have **{slaBreaches.length}** support tickets past the SLA deadline.
                            </p>
                            <Link
                                to="/support"
                                className="mt-6 inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-colors relative z-10"
                            >
                                Resolve Now
                                <ChevronRight className="h-3 w-3" />
                            </Link>
                        </div>
                    )}

                    {/* Subscription Snapshot */}
                    <div className="bg-gray-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 blur-[60px] rounded-full -mr-16 -mt-16" />
                        <p className="text-[9px] font-black text-brand-400 uppercase tracking-widest mb-2">Membership Status</p>
                        <h4 className="text-2xl font-black">{subscription.plan}</h4>
                        <div className="mt-6 flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest border-t border-white/5 pt-4">
                            <span>Team Usage</span>
                            <span className="text-white">{seats.used} / {seats.total}</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                            <div
                                className="h-full bg-brand-500 transition-all"
                                style={{ width: `${(seats.used / seats.total) * 100}%` }}
                            />
                        </div>
                        <Link to="/users" className="mt-6 block text-center bg-white text-gray-900 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-500 hover:text-white transition-all">
                            Manage Team
                        </Link>
                    </div>

                    {/* Quick Insight */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Daily Insight</p>
                        <p className="text-sm font-bold text-gray-900 leading-relaxed">
                            "High quote-to-deal conversion in the last 24h. Recommend increasing stock for SUV models."
                        </p>
                        <div className="mt-6 flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                <TrendingUp className="h-4 w-4" />
                            </div>
                            <span className="text-xs font-bold text-emerald-600">+18% vs yesterday</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
