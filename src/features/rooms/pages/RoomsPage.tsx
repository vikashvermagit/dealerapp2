import { useNavigate } from 'react-router-dom';
import { useInvitationStore } from '../../invitations/store';
import { useRoomStore } from '../store';
import { useStockStore } from '../../stock/store';
import { useQuoteStore } from '../../quotes/store';
import {
    MessageSquare,
    ArrowRight,
    Clock,
    CheckCircle2,
    Lock
} from 'lucide-react';
import clsx from 'clsx';

export const RoomsPage = () => {
    const navigate = useNavigate();
    const { invitations } = useInvitationStore();
    const { rooms } = useRoomStore();
    const { hasStockDeclared, getDeclarationByInvitation } = useStockStore();
    const { quotes } = useQuoteStore();

    // Only invitations that are 'joined' or 'expired' but were joined
    const joinedInvitations = invitations.filter(inv => inv.status === 'joined');

    // Merge with Room state
    const activeRooms = joinedInvitations.map(inv => ({
        ...inv,
        room: rooms[inv.id] || { status: 'live', lastActivity: inv.expiresAt }
    }));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Active Rooms</h1>
                    <p className="text-gray-500 mt-1 font-medium">Manage your active negotiations and fulfillment commitments.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {activeRooms.length === 0 ? (
                    <div className="py-20 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                        <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No active rooms found.</p>
                        <button
                            onClick={() => navigate('/invitations')}
                            className="mt-6 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-brand-600 transition-all text-xs uppercase tracking-widest"
                        >
                            Find Invitations
                        </button>
                    </div>
                ) : (
                    activeRooms.map((room) => {
                        const declaration = getDeclarationByInvitation(room.id);
                        const quote = quotes.find(q => q.invitationId === room.id);
                        const status = room.room.status;

                        return (
                            <div
                                key={room.id}
                                onClick={() => navigate(`/active-rooms/${room.id}`)}
                                className="group bg-white rounded-[2rem] border border-gray-100 p-8 flex flex-col md:flex-row items-center gap-8 hover:shadow-2xl hover:border-brand-100 transition-all cursor-pointer relative overflow-hidden"
                            >
                                {/* Status Indicator Sidebar */}
                                <div className={clsx(
                                    "absolute left-0 top-0 bottom-0 w-2 transition-all group-hover:w-3",
                                    status === 'live' ? "bg-brand-500" :
                                        status === 'pending' ? "bg-amber-500" : "bg-gray-300"
                                )} />

                                {/* Info Section */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight truncate">
                                            {room.customerName}
                                        </h3>
                                        <span className={clsx(
                                            "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest",
                                            status === 'live' ? "bg-brand-50 text-brand-700" :
                                                status === 'pending' ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-600"
                                        )}>
                                            {status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        <span>{room.vehicleModel}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-200" />
                                        <span>{room.year}</span>
                                    </div>
                                </div>

                                {/* Dynamic Stats */}
                                <div className="flex items-center gap-6">
                                    {/* Stock Badge */}
                                    <div className="flex flex-col items-center gap-1">
                                        <div className={clsx(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                                            hasStockDeclared(room.id)
                                                ? (declaration?.status === 'breached' ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600")
                                                : "bg-gray-50 text-gray-300"
                                        )}>
                                            {hasStockDeclared(room.id) ? <CheckCircle2 className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                                        </div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Inventory</p>
                                    </div>

                                    {/* Quote Badge */}
                                    <div className="flex flex-col items-center gap-1">
                                        <div className={clsx(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                                            quote
                                                ? (quote.status === 'locked' ? "bg-brand-500 text-white" : "bg-brand-50 text-brand-600")
                                                : "bg-gray-50 text-gray-300"
                                        )}>
                                            {quote?.status === 'locked' ? <Lock className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                                        </div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Quotation</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center group-hover:border-brand-500 group-hover:bg-brand-50 transition-all">
                                        <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-brand-600 transition-all" />
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

const FileText = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" />
    </svg>
);
