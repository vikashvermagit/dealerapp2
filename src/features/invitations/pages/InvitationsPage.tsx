import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvitationStore } from '../store';
import { useStockStore } from '../../stock/store';
import { useRoomStore } from '../../rooms/store';
import { StockSelector } from '../../stock/components/StockSelector';
import { CountDownTimer } from '../components/CountDownTimer';
import { Users, Car, CreditCard, ChevronRight, CheckCircle2, ShieldCheck, Ship, Calendar } from 'lucide-react';
import clsx from 'clsx';
import type { Invitation } from '../types';

export const InvitationsPage = () => {
    const { invitations, credits, joinInvitation, declineInvitation, completeStockConsent } = useInvitationStore();
    const { getDeclarationByInvitation, hasStockDeclared, checkDeadlines } = useStockStore();
    const { syncRoom } = useRoomStore();
    const navigate = useNavigate();

    useEffect(() => {
        checkDeadlines();
    }, [checkDeadlines]);

    const [selectedInvitationId, setSelectedInvitationId] = useState<string | null>(null);
    const [showConsent, setShowConsent] = useState(false);
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [declineReason, setDeclineReason] = useState('');

    const handleComposeQuote = (inv: Invitation) => {
        if (!hasStockDeclared(inv.id)) {
            setSelectedInvitationId(inv.id);
            setShowConsent(true);
            return;
        }
        navigate(`/active-rooms/${inv.id}`);
    };

    const handleJoinClick = (id: string) => {
        if (credits <= 0) {
            alert('Insufficient credits to join this invitation.');
            return;
        }
        joinInvitation(id);
        syncRoom(id); // Initialize room lifecycle
        setSelectedInvitationId(id);
        setShowConsent(true);
    };

    const handleDeclineClick = (id: string) => {
        setSelectedInvitationId(id);
        setShowDeclineModal(true);
    };

    const submitDecline = () => {
        if (selectedInvitationId && declineReason.trim()) {
            declineInvitation(selectedInvitationId, declineReason);
            setShowDeclineModal(false);
            setDeclineReason('');
            setSelectedInvitationId(null);
        }
    };

    const handleConsentComplete = () => {
        if (selectedInvitationId) {
            completeStockConsent(selectedInvitationId);
            const id = selectedInvitationId; // closure safety
            setShowConsent(false);
            setSelectedInvitationId(null);
            // Navigate to workspace immediately after consent
            navigate(`/active-rooms/${id}`);
        }
    };

    const pendingInvitations = invitations.filter(i => i.status === 'pending');
    const joinedInvitations = invitations.filter(i => i.status === 'joined');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header / Credits Area */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Invitations Inbox</h1>
                    <p className="text-gray-500 mt-1">Accept invitations to start quoting customers.</p>
                </div>
                <div className="flex items-center gap-4 bg-brand-50 px-5 py-3 rounded-xl border border-brand-100">
                    <div className="bg-brand-500 p-2 rounded-lg shadow-sm">
                        <CreditCard className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider">Available Credits</p>
                        <p className="text-2xl font-black text-brand-900 leading-none">{credits}</p>
                    </div>
                </div>
            </div>

            {/* Stock Declaration Overlay */}
            {showConsent && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <StockSelector
                        invitationId={selectedInvitationId!}
                        onComplete={handleConsentComplete}
                        onCancel={() => setShowConsent(false)}
                    />
                </div>
            )}

            {/* Decline Modal Overlay */}
            {showDeclineModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl border p-8 max-w-md w-full shadow-2xl space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">Decline Invitation</h2>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Reason for declining</label>
                            <textarea
                                value={declineReason}
                                onChange={(e) => setDeclineReason(e.target.value)}
                                placeholder="e.g. Model out of stock, budget too low..."
                                className="w-full h-32 p-4 border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none outline-none"
                            />
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowDeclineModal(false)}
                                className="flex-1 px-5 py-3 border rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={!declineReason.trim()}
                                onClick={submitDecline}
                                className="flex-1 px-5 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Confirm Decline
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pending Invitations Section */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
                        <h2 className="text-xl font-bold text-gray-900">New Invitations ({pendingInvitations.length})</h2>
                    </div>

                    <div className="space-y-4">
                        {pendingInvitations.length === 0 ? (
                            <div className="p-12 text-center bg-gray-50 rounded-2xl border border-dashed text-gray-400">
                                <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                <p>No new invitations at the moment.</p>
                            </div>
                        ) : (
                            pendingInvitations.map((inv) => (
                                <div key={inv.id} className="bg-white rounded-2xl border p-6 hover:shadow-lg transition-all duration-300 group border-l-4 border-l-brand-400">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-gray-100 p-3 rounded-full">
                                                <Users className="h-5 w-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 group-hover:text-brand-600 transition-colors">{inv.customerName}</h3>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                                    <Car className="h-3 w-3" />
                                                    <span>{inv.year} {inv.vehicleModel}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <CountDownTimer expiresAt={inv.expiresAt} />
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-xl mb-6">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Customer Budget</span>
                                            <span className="font-black text-gray-900">{inv.budget}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleJoinClick(inv.id)}
                                            className="flex-[2] bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-brand-600 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-brand-100"
                                        >
                                            Join Request
                                            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-black uppercase">1 Credit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDeclineClick(inv.id)}
                                            className="flex-1 bg-white border border-gray-200 text-gray-500 py-3 rounded-xl font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Active / Joined Section */}
                <section className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900">Active Requests ({joinedInvitations.length})</h2>
                    <div className="space-y-4">
                        {joinedInvitations.length === 0 ? (
                            <div className="p-12 text-center bg-gray-50 rounded-2xl border border-dashed text-gray-400">
                                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                <p>You haven't joined any requests yet.</p>
                            </div>
                        ) : (
                            joinedInvitations.map((inv) => (
                                <div key={inv.id} className="bg-white rounded-2xl border p-6 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-brand-50 p-3 rounded-full">
                                                <Users className="h-5 w-5 text-brand-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{inv.customerName}</h3>
                                                <p className="text-xs text-brand-600 font-medium">Joined & Active</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">ID: {inv.id}</span>
                                    </div>

                                    <div className="space-y-4">
                                        <div className={clsx(
                                            "flex items-center gap-3 p-4 rounded-xl border transition-colors",
                                            hasStockDeclared(inv.id)
                                                ? getDeclarationByInvitation(inv.id)?.status === 'breached'
                                                    ? "bg-red-50 border-red-200 text-red-700"
                                                    : "bg-green-50 border-green-200 text-green-700"
                                                : "bg-orange-50 border-orange-200 text-orange-700"
                                        )}>
                                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                                {hasStockDeclared(inv.id) ? (
                                                    getDeclarationByInvitation(inv.id)?.mode === 'in_stock' ? <Car className="h-5 w-5" /> :
                                                        getDeclarationByInvitation(inv.id)?.mode === 'incoming' ? <Ship className="h-5 w-5" /> :
                                                            <Calendar className="h-5 w-5" />
                                                ) : (
                                                    <ShieldCheck className="h-5 w-5 text-orange-400" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] font-black uppercase tracking-wider">Inventory Status</p>
                                                <p className="text-sm font-bold capitalize">
                                                    {hasStockDeclared(inv.id)
                                                        ? getDeclarationByInvitation(inv.id)?.mode.replace('_', ' ')
                                                        : 'Pending Declaration'}
                                                </p>
                                            </div>
                                            {!hasStockDeclared(inv.id) && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedInvitationId(inv.id);
                                                        setShowConsent(true);
                                                    }}
                                                    className="px-3 py-1.5 bg-white border border-orange-200 rounded-lg text-[10px] font-black uppercase hover:shadow-sm"
                                                >
                                                    Select
                                                </button>
                                            )}
                                        </div>

                                        <button
                                            disabled={!hasStockDeclared(inv.id)}
                                            onClick={() => handleComposeQuote(inv)}
                                            className={clsx(
                                                "w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
                                                hasStockDeclared(inv.id)
                                                    ? "bg-gray-900 text-white hover:bg-brand-600 shadow-lg"
                                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            )}
                                        >
                                            Compose Quote
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};
