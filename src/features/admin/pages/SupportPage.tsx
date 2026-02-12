import { useState } from 'react';
import { useAdminStore } from '../store';
import {
    Plus,
    Search,
    Clock,
    AlertCircle,
    CheckCircle2,
    MessageSquare,
    ShieldAlert,
    ChevronRight
} from 'lucide-react';
import clsx from 'clsx';
import type { TicketPriority } from '../types';

export const SupportPage = () => {
    const { tickets, addTicket } = useAdminStore();
    const [isCreating, setIsCreating] = useState(false);
    const [newSubject, setNewSubject] = useState('');
    const [newPriority, setNewPriority] = useState<TicketPriority>('medium');

    const handleCreate = () => {
        if (!newSubject) return;
        addTicket(newSubject, newPriority);
        setNewSubject('');
        setIsCreating(false);
    };

    const getPriorityColor = (p: TicketPriority) => {
        switch (p) {
            case 'critical': return 'text-red-600 bg-red-50 border-red-100';
            case 'high': return 'text-orange-600 bg-orange-50 border-orange-100';
            case 'medium': return 'text-blue-600 bg-blue-50 border-blue-100';
            default: return 'text-gray-600 bg-gray-50 border-gray-100';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Support & Disputes</h1>
                    <p className="text-gray-500 mt-1">Raise tickets for billing, orders, or technical issues.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-600 transition-all shadow-lg active:scale-95"
                >
                    <Plus className="h-4 w-4" />
                    New Ticket
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Stats */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <MessageSquare className="h-6 w-6 text-brand-600 mb-4" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Open Tickets</p>
                        <p className="text-3xl font-black text-gray-900 mt-2">{tickets.filter(t => t.status === 'open').length}</p>
                    </div>
                    <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
                        <ShieldAlert className="h-6 w-6 text-red-600 mb-4" />
                        <p className="text-[10px] font-black text-red-400 uppercase tracking-widest leading-none">SLA Breached</p>
                        <p className="text-3xl font-black text-red-600 mt-2">
                            {tickets.filter(t => new Date(t.slaDeadline) < new Date() && t.status !== 'resolved').length}
                        </p>
                    </div>
                </div>

                {/* Ticket List */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b flex items-center gap-2">
                            <Search className="h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by ID or subject..."
                                className="bg-transparent border-none outline-none text-sm flex-1 font-medium"
                            />
                        </div>
                        <div className="divide-y">
                            {tickets.map(ticket => {
                                const isSlaBreached = new Date(ticket.slaDeadline) < new Date() && ticket.status !== 'resolved';
                                return (
                                    <div key={ticket.id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className={clsx(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center border",
                                                getPriorityColor(ticket.priority)
                                            )}>
                                                {ticket.status === 'open' ? <Clock className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{ticket.id}</span>
                                                    <span className={clsx(
                                                        "text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border",
                                                        ticket.status === 'open' ? "text-brand-600 border-brand-100 bg-brand-50" : "text-green-600 border-green-100 bg-green-50"
                                                    )}>
                                                        {ticket.status}
                                                    </span>
                                                </div>
                                                <h4 className="font-bold text-gray-900 mt-1">{ticket.subject}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <AlertCircle className={clsx("h-3 w-3", isSlaBreached ? "text-red-500" : "text-gray-300")} />
                                                    <p className={clsx(
                                                        "text-[10px] font-bold uppercase tracking-widest",
                                                        isSlaBreached ? "text-red-600 animate-pulse" : "text-gray-400"
                                                    )}>
                                                        SLA: {isSlaBreached ? 'Breached' : `Due by ${new Date(ticket.slaDeadline).toLocaleTimeString()}`}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="p-2 bg-gray-100 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-500 hover:text-white">
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Ticket Modal */}
            {isCreating && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Raise Support Ticket</h3>
                            <p className="text-gray-500 mt-1 text-sm">We'll get back to you within your plan's SLA window.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Subject</label>
                                <input
                                    type="text"
                                    value={newSubject}
                                    onChange={(e) => setNewSubject(e.target.value)}
                                    placeholder="Brief description of the issue..."
                                    className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-brand-500 transition-all font-medium text-gray-900"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Priority Level</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(['low', 'medium', 'high'] as const).map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setNewPriority(p)}
                                            className={clsx(
                                                "py-3 rounded-xl border text-xs font-bold capitalize transition-all",
                                                newPriority === p
                                                    ? "bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-100"
                                                    : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                                            )}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={() => setIsCreating(false)}
                                className="flex-1 py-4 font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest text-xs"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                className="flex-2 bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-brand-600 transition-all active:scale-95"
                            >
                                Submit Ticket
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
