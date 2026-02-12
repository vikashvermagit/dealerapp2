import { useState, useEffect } from 'react';
import { useInvitationStore } from '../../invitations/store';
import { useStockStore } from '../store';
import { StockSelector } from '../components/StockSelector';
import {
    Car,
    ShieldCheck,
    AlertCircle,
    Ship,
    Calendar,
    Search,
    ArrowUpRight,
    Clock,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import clsx from 'clsx';

export const StockPage = () => {
    const { invitations } = useInvitationStore();
    const { getDeclarationByInvitation, checkDeadlines } = useStockStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending' | 'breached'>('all');
    const [selectedInvId, setSelectedInvId] = useState<string | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            checkDeadlines();
        }, 60000); // Check deadlines every minute
        return () => clearInterval(interval);
    }, [checkDeadlines]);

    const joinedInvitations = invitations.filter(inv => inv.status === 'joined');

    const stockList = joinedInvitations.map(inv => ({
        ...inv,
        declaration: getDeclarationByInvitation(inv.id)
    }));

    const filteredStock = stockList.filter(item => {
        const matchesSearch =
            item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.declaration?.vin?.toLowerCase().includes(searchTerm.toLowerCase()));

        const status = item.declaration?.status || 'pending';
        const matchesStatus = filterStatus === 'all' || status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: stockList.length,
        verified: stockList.filter(s => s.declaration?.status === 'verified').length,
        pending: stockList.filter(s => !s.declaration || s.declaration.status === 'pending').length,
        breached: stockList.filter(s => s.declaration?.status === 'breached').length
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        Stock Registry
                        <div className="bg-brand-500 h-2 w-2 rounded-full animate-pulse" />
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Monitor and manage vehicle commitments for active deals.</p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="flex-1 md:w-64 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by VIN, Model..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-500 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Registered Units', value: stats.total, icon: Car, color: 'text-gray-600', bg: 'bg-gray-100' },
                    { label: 'Verified VINs', value: stats.verified, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Awaiting Commitment', value: stats.pending, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
                    { label: 'Compliance Breach', value: stats.breached, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border shadow-sm group hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className={clsx("p-3 rounded-2xl", stat.bg, stat.color)}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <span className="text-[10px] font-black p-1 bg-gray-50 rounded text-gray-400 uppercase tracking-widest">Global</span>
                        </div>
                        <p className="text-3xl font-black text-gray-900 leading-none">{stat.value}</p>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* List Header & Filters */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-6">
                    {(['all', 'verified', 'pending', 'breached'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={clsx(
                                "text-xs font-black uppercase tracking-widest pb-2 transition-all border-b-2",
                                filterStatus === status
                                    ? "text-brand-600 border-brand-600"
                                    : "text-gray-400 border-transparent hover:text-gray-600"
                            )}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stock Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredStock.length === 0 ? (
                    <div className="xl:col-span-2 py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                        <div className="p-6 bg-white rounded-full shadow-sm mb-4">
                            <Search className="h-10 w-10 text-gray-200" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 uppercase">No Matches Found</h3>
                        <p className="text-gray-500 font-medium">Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    filteredStock.map((item) => (
                        <div key={item.id} className="bg-white group rounded-[2.5rem] border p-8 hover:shadow-2xl hover:shadow-brand-100/50 transition-all duration-500 flex flex-col sm:flex-row gap-8 items-stretch relative overflow-hidden">
                            {/* Status Ribbon */}
                            <div className={clsx(
                                "absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rotate-45",
                                !item.declaration || item.declaration.status === 'pending' ? "bg-orange-500/10" :
                                    item.declaration.status === 'verified' ? "bg-emerald-500/10" : "bg-red-500/10"
                            )} />

                            {/* Info Section */}
                            <div className="flex-1 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest px-2 py-0.5 bg-brand-50 rounded">Active Request</span>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">#{item.id}</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{item.vehicleModel}</h3>
                                        <p className="text-gray-500 font-bold text-sm">Customer: {item.customerName}</p>
                                    </div>
                                    <div className={clsx(
                                        "p-4 rounded-2xl flex items-center justify-center",
                                        !item.declaration || item.declaration.status === 'pending' ? "bg-orange-50 text-orange-600" :
                                            item.declaration.status === 'verified' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                                    )}>
                                        {!item.declaration || item.declaration.status === 'pending' ? <Clock className="h-6 w-6" /> :
                                            item.declaration.status === 'verified' ? <ShieldCheck className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Stock Type</p>
                                        <p className="font-bold flex items-center gap-2">
                                            {item.declaration ? (
                                                <>
                                                    {item.declaration.mode === 'in_stock' ? <Car className="h-4 w-4 text-emerald-500" /> :
                                                        item.declaration.mode === 'incoming' ? <Ship className="h-4 w-4 text-blue-500" /> :
                                                            <Calendar className="h-4 w-4 text-purple-500" />}
                                                    <span className="capitalize">
                                                        {item.declaration.mode === 'in_stock' ? 'In-Stock (VIN Ready)' :
                                                            item.declaration.mode === 'incoming' ? 'Incoming Allocation (ETA Known)' :
                                                                'Advance Order (Buyer Consent Required)'}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-gray-400">Not Declared</span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">VIN Number</p>
                                        <p className="font-mono font-bold tracking-widest uppercase">
                                            {item.declaration?.vin || '—————————'}
                                        </p>
                                    </div>
                                </div>

                                {item.declaration?.mode === 'incoming' && (
                                    <div className="flex items-center gap-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                                        <div>
                                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Expected ETA</p>
                                            <p className="text-sm font-black text-blue-900">{new Date(item.declaration.eta!).toLocaleDateString()}</p>
                                        </div>
                                        <div className="h-8 w-px bg-blue-100" />
                                        <div>
                                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">VIN Deadline</p>
                                            <p className={clsx(
                                                "text-sm font-black",
                                                item.declaration.status === 'breached' ? "text-red-600" : "text-blue-900"
                                            )}>
                                                {new Date(item.declaration.vinDeadline!).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Actions Section */}
                            <div className="sm:border-l border-gray-100 sm:pl-8 flex flex-col justify-center gap-4">
                                {!item.declaration ? (
                                    <button
                                        onClick={() => setSelectedInvId(item.id)}
                                        className="w-full sm:w-40 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-600 transition-all flex items-center justify-center gap-2 group"
                                    >
                                        Declare Now
                                        <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </button>
                                ) : item.declaration.status === 'pending' ? (
                                    <button
                                        onClick={() => setSelectedInvId(item.id)}
                                        className="w-full sm:w-40 py-4 border-2 border-orange-500 text-orange-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-orange-50 transition-all"
                                    >
                                        Verify Unit
                                    </button>
                                ) : (
                                    <button
                                        className="w-full sm:w-40 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-[10px] cursor-not-allowed border"
                                    >
                                        Details Locked
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Declaration Modal */}
            {selectedInvId && (
                <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <StockSelector
                        invitationId={selectedInvId}
                        onComplete={() => setSelectedInvId(null)}
                        onCancel={() => setSelectedInvId(null)}
                    />
                </div>
            )}
        </div>
    );
};
