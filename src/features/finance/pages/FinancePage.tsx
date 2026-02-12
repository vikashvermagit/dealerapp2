import { useState } from 'react';
import { useFinanceStore } from '../store';
import {
    Wallet,
    History,
    Download,
    TrendingUp,
    TrendingDown,
    ShieldCheck,
    PlusCircle,
    Gem,
    AlertTriangle
} from 'lucide-react';
import clsx from 'clsx';

export const FinancePage = () => {
    const { balance, ledger, subscription, invoices, addTransaction } = useFinanceStore();
    const [activeTab, setActiveTab] = useState<'wallet' | 'billing' | 'invoices'>('wallet');

    const handleTopUp = () => {
        const amount = 1000;
        addTransaction('credit_purchase', amount, 'Wallet top-up via Credit Card');
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Financial Hub</h1>
                    <p className="text-gray-500 mt-1">Manage your wallet, subscriptions, and financial logs.</p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    {(['wallet', 'billing', 'invoices'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={clsx(
                                "px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all",
                                activeTab === tab
                                    ? "bg-white text-brand-600 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'wallet' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Wallet Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-gray-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-gray-200">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 blur-3xl rounded-full -mr-10 -mt-10" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-400/10 blur-2xl rounded-full -ml-8 -mb-8" />

                            <div className="flex justify-between items-start mb-12 relative z-10">
                                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                                    <Wallet className="h-6 w-6 text-brand-400" />
                                </div>
                                <ShieldCheck className="h-5 w-5 text-green-400" />
                            </div>

                            <div className="space-y-1 relative z-10">
                                <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Available Balance</p>
                                <h2 className="text-5xl font-black tracking-tighter">${balance.toLocaleString()}</h2>
                            </div>

                            <div className="mt-12 flex gap-3 relative z-10">
                                <button
                                    onClick={handleTopUp}
                                    className="flex-1 bg-brand-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-400 transition-colors shadow-lg shadow-brand-900/40"
                                >
                                    Top Up Wallet
                                </button>
                                <button className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors backdrop-blur-md">
                                    <PlusCircle className="h-5 w-5 text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                <TrendingUp className="h-5 w-5 text-green-500 mb-3" />
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Monthly In</p>
                                <p className="text-xl font-bold text-gray-900 mt-1">$12,450</p>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                <TrendingDown className="h-5 w-5 text-red-500 mb-3" />
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Monthly Out</p>
                                <p className="text-xl font-bold text-gray-900 mt-1">$4,200</p>
                            </div>
                        </div>
                    </div>

                    {/* Ledger List */}
                    <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 flex flex-col h-[600px]">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <div className="bg-gray-100 p-2 rounded-xl">
                                    <History className="h-5 w-5 text-gray-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Transactional Ledger</h3>
                            </div>
                            <button className="text-xs font-black text-brand-600 uppercase tracking-widest hover:underline">Download PDF</button>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                            {ledger.map((entry) => (
                                <div key={entry.id} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 active:scale-[0.99]">
                                    <div className="flex items-center gap-4">
                                        <div className={clsx(
                                            "p-3 rounded-xl transition-colors",
                                            entry.amount > 0 ? "bg-green-50 text-green-600 group-hover:bg-green-100" : "bg-red-50 text-red-600 group-hover:bg-red-100"
                                        )}>
                                            {entry.amount > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{entry.description}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{entry.type.replace(/_/g, ' ')}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-200" />
                                                <span className="text-[10px] text-gray-400">{new Date(entry.timestamp).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={clsx(
                                            "text-sm font-black",
                                            entry.amount > 0 ? "text-green-600" : "text-red-600"
                                        )}>
                                            {entry.amount > 0 ? '+' : ''}{entry.amount.toLocaleString()}
                                        </p>
                                        <p className="text-[10px] text-gray-400 mt-1">Balance: ${entry.balanceAfter.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'billing' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Subscription View */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8">
                            <Gem className="h-24 w-24 text-brand-50  -mr-12 -mt-12 group-hover:scale-110 transition-transform" />
                        </div>

                        <div className="relative z-10">
                            <span className="bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Active Plan</span>
                            <h3 className="text-4xl font-black text-gray-900 mt-4">{subscription.plan} Member</h3>
                            <p className="text-gray-500 mt-2">Professional level access for high-volume dealers.</p>

                            <div className="mt-12 space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                    <span className="text-sm font-bold text-gray-600">Next Renewal</span>
                                    <span className="text-sm font-black text-gray-900">{new Date(subscription.expiresAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                    <span className="text-sm font-bold text-gray-600">Auto-Renew</span>
                                    <div className="w-12 h-6 bg-brand-500 rounded-full flex items-center px-1">
                                        <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 flex gap-4">
                                <button className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors">
                                    Upgrade Plan
                                </button>
                                <button className="flex-1 bg-white border border-gray-200 text-red-600 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-50 transition-colors">
                                    Cancel Plan
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Add-ons & Penalties Section */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight px-2">Marketplace Add-ons</h3>
                        <div className="space-y-4">
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-brand-300 transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="bg-brand-50 p-3 rounded-2xl text-brand-600">
                                        <TrendingUp className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Priority Listing</h4>
                                        <p className="text-xs text-gray-500">Boost your quotes for 24 hours.</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-gray-900">$25.00</p>
                                    <button className="text-[10px] font-black text-brand-600 uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Buy Now</button>
                                </div>
                            </div>

                            <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 flex items-center justify-between">
                                <div className="flex items-center gap-4 text-orange-800">
                                    <div className="bg-white p-3 rounded-2xl text-orange-600 shadow-sm">
                                        <AlertTriangle className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Pending Penalties</h4>
                                        <p className="text-xs opacity-80">You have no outstanding penalties. Good standing!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'invoices' && (
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Invoice ID</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="text-right px-8 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {invoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-8 py-6 font-bold text-gray-900 text-sm">{inv.id}</td>
                                    <td className="px-8 py-6 text-gray-500 text-sm">{new Date(inv.date).toLocaleDateString()}</td>
                                    <td className="px-8 py-6 font-black text-gray-900 text-sm">${inv.amount.toLocaleString()}</td>
                                    <td className="px-8 py-6">
                                        <span className="bg-green-100 text-green-700 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded">
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-brand-600">
                                            <Download className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
