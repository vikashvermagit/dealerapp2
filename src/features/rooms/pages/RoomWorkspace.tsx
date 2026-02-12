import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvitationStore } from '../../invitations/store';
import { useRoomStore } from '../store';
import { useStockStore } from '../../stock/store';
import { useQuoteStore } from '../../quotes/store';
import { StockSelector } from '../../stock/components/StockSelector';
import { QuoteBuilder } from '../../quotes/components/QuoteBuilder';
import {
    ArrowLeft,
    ShieldCheck,
    Ship,
    Calendar,
    AlertCircle,
    XCircle,
    Car,
    AlertTriangle,
    ArrowRight,
    Clock
} from 'lucide-react';
import clsx from 'clsx';

export const RoomWorkspace = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { invitations } = useInvitationStore();
    const { getRoom, updateRoomStatus, cancelParticipation } = useRoomStore();
    const { getDeclarationByInvitation, hasStockDeclared } = useStockStore();
    const { quotes, createQuote } = useQuoteStore();

    const invitation = invitations.find(i => i.id === id);
    const room = getRoom(id!);
    const declaration = getDeclarationByInvitation(id!);
    const quote = quotes.find(q => q.invitationId === id);

    const [showStockSelector, setShowStockSelector] = useState(false);
    const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);

    if (!invitation || !room) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <AlertCircle className="h-12 w-12 text-gray-300" />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Room not found.</p>
                <button onClick={() => navigate('/active-rooms')} className="text-brand-600 font-bold text-sm">Return to Rooms</button>
            </div>
        );
    }

    const handleAbandon = () => {
        cancelParticipation(id!);
        navigate('/active-rooms');
    };

    const handleCreateQuote = () => {
        if (!hasStockDeclared(id!)) return;
        createQuote(id!, invitation.customerName, invitation.vehicleModel);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Workspace Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <MessageSquareIcon className="h-32 w-32" />
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => navigate('/active-rooms')}
                        className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-brand-600 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Rooms
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight">{invitation.customerName}</h1>
                            <span className="px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-100">
                                {room.status}
                            </span>
                        </div>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                            {invitation.year} {invitation.vehicleModel} • Budget: {invitation.budget}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowAbandonConfirm(true)}
                        className="px-6 py-4 bg-red-50 text-red-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-100 transition-all flex items-center gap-2 border border-red-100"
                    >
                        <XCircle className="h-4 w-4" />
                        Abandon Room
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 1. Fulfillment Lane */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-4">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <ShieldCheck className="h-4 w-4" />
                        </div>
                        <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Inventory Commitment</h2>
                    </div>

                    <div className={clsx(
                        "p-8 rounded-[2rem] border-2 transition-all",
                        hasStockDeclared(id!)
                            ? "bg-white border-emerald-100"
                            : "bg-gray-50/50 border-dashed border-gray-200"
                    )}>
                        {!hasStockDeclared(id!) ? (
                            <div className="text-center space-y-6">
                                <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 inline-block">
                                    <Car className="h-8 w-8 text-gray-300" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-900 uppercase tracking-widest mb-1">State: Undefined</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter leading-relaxed">
                                        You must declare stock availability before quoting. This commitment is legally binding.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowStockSelector(true)}
                                    className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-600 transition-all shadow-xl shadow-gray-200"
                                >
                                    Declare Now
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className={clsx(
                                        "p-3 rounded-2xl",
                                        declaration?.status === 'breached' ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                                    )}>
                                        {declaration?.mode === 'in_stock' ? <Car className="h-6 w-6" /> :
                                            declaration?.mode === 'incoming' ? <Ship className="h-6 w-6" /> :
                                                <Calendar className="h-6 w-6" />}
                                    </div>
                                    <span className={clsx(
                                        "px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest",
                                        declaration?.status === 'verified' ? "bg-emerald-100 text-emerald-700" :
                                            declaration?.status === 'breached' ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                                    )}>
                                        {declaration?.status}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Commitment</p>
                                    <p className="text-lg font-black text-gray-900 uppercase truncate">
                                        {declaration?.mode === 'in_stock' ? 'In-Stock (VIN Ready)' :
                                            declaration?.mode === 'incoming' ? 'Incoming Allocation' :
                                                'Advance Order Required'}
                                    </p>
                                    {declaration?.vin && (
                                        <code className="text-[10px] bg-gray-100 px-2 py-1 rounded-md font-mono font-bold text-gray-600 block mt-2">
                                            VIN: {declaration.vin}
                                        </code>
                                    )}
                                    {declaration?.eta && (
                                        <p className="text-[10px] font-bold text-gray-500 mt-2 flex items-center gap-2">
                                            <Clock className="h-3 w-3" />
                                            ETA: {declaration.eta}
                                        </p>
                                    )}
                                </div>

                                {declaration?.status === 'pending' && (
                                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                                        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                                        <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
                                            Fulfillment pending. Ensure VIN is issued before {declaration.vinDeadline}.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Quotation Workspace (Large) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-3 px-4">
                        <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
                            <FileTextIcon className="h-4 w-4" />
                        </div>
                        <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Pricing Strategy</h2>
                    </div>

                    {!quote ? (
                        <div className={clsx(
                            "bg-white rounded-[2rem] border border-gray-100 p-12 flex flex-col items-center justify-center text-center space-y-6 transition-all",
                            !hasStockDeclared(id!) ? "opacity-50 pointer-events-none" : "hover:border-brand-200"
                        )}>
                            <div className="p-6 bg-brand-50 rounded-full text-brand-600">
                                <FileTextIcon className="h-10 w-10" />
                            </div>
                            <div className="max-w-xs mx-auto">
                                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Draft a Proposal</h3>
                                <p className="text-xs text-gray-500 mt-2 font-medium leading-relaxed">
                                    Set your price and terms. You have 3 revisions available after the initial submission.
                                </p>
                            </div>
                            <button
                                onClick={handleCreateQuote}
                                className="px-10 py-4 bg-brand-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-600 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-100 flex items-center gap-2"
                            >
                                Start Quoting
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-2xl h-[600px] flex flex-col">
                            <QuoteBuilder
                                quote={quote}
                                onClose={() => { }} // No-op in workspace
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showStockSelector && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <StockSelector
                        invitationId={id!}
                        onComplete={() => {
                            setShowStockSelector(false);
                            updateRoomStatus(id!, 'live');
                        }}
                        onCancel={() => setShowStockSelector(false)}
                    />
                </div>
            )}

            {showAbandonConfirm && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] p-10 max-w-md w-full shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-100">
                            <AlertTriangle className="h-10 w-10 text-red-600" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Abandon Room?</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100 text-[10px] text-red-800 font-bold uppercase leading-relaxed tracking-wider">
                                WARNING: Credits spent to join this room will NOT be refunded. Frequent abandonment may affect your dealership quality score.
                            </div>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={() => setShowAbandonConfirm(false)}
                                className="flex-1 py-4 font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest text-xs"
                            >
                                Stay in Room
                            </button>
                            <button
                                onClick={handleAbandon}
                                className="flex-1 bg-red-600 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-red-100 hover:bg-red-700"
                            >
                                Confirm Abandon
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const MessageSquareIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
);

const FileTextIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>
);
