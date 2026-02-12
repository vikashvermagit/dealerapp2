import { useState } from 'react';
import { useQuoteStore } from '../store';
import { useStockStore } from '../../stock/store';
import { useRoomStore } from '../../rooms/store';
import type { Quote } from '../types';
import { History, Lock, AlertTriangle, ShieldCheck, Save, Car, Ship, Calendar, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface QuoteBuilderProps {
    quote: Quote;
    onClose: () => void;
}

export const QuoteBuilder = ({ quote, onClose }: QuoteBuilderProps) => {
    const { updateQuote, lockQuote } = useQuoteStore();
    const { getDeclarationByInvitation } = useStockStore();
    const { updateRoomStatus } = useRoomStore();
    const declaration = getDeclarationByInvitation(quote.invitationId);

    const currentVersion = quote.versions[quote.currentVersionIndex];

    const [formData, setFormData] = useState({
        price: currentVersion.price,
        deliveryDays: currentVersion.deliveryDays,
        terms: currentVersion.terms,
    });

    const [showHistory, setShowHistory] = useState(false);
    const [showLockConfirm, setShowLockConfirm] = useState(false);

    const canEdit = quote.status === 'draft' && quote.editCount < quote.maxEdits;
    const isLocked = quote.status === 'locked';

    const handleSave = () => {
        if (!canEdit) return;
        updateQuote(quote.id, formData);
    };

    const handleLock = () => {
        lockQuote(quote.id);
        updateRoomStatus(quote.invitationId, 'pending');
        setShowLockConfirm(false);
    };

    return (
        <div className="bg-white rounded-2xl border shadow-xl overflow-hidden max-w-4xl w-full flex h-[80vh]">
            {/* Main Builder Form */}
            <div className="flex-1 p-8 flex flex-col">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Quote Builder</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Customer: <span className="font-semibold">{quote.customerName}</span> • {quote.vehicleModel}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Stock Badge */}
                        {declaration && (
                            <div className={clsx(
                                "flex items-center gap-2 px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest",
                                declaration.status === 'breached' ? "bg-red-50 text-red-600 border-red-100" : "bg-gray-50 text-gray-600 border-gray-100"
                            )}>
                                {declaration.mode === 'in_stock' ? <Car className="h-3 w-3" /> :
                                    declaration.mode === 'incoming' ? <Ship className="h-3 w-3" /> :
                                        <Calendar className="h-3 w-3" />}
                                {declaration.mode.replace('_', ' ')}
                            </div>
                        )}
                        <span className={clsx(
                            "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
                            isLocked ? "bg-green-50 text-green-700 border-green-200" : "bg-brand-50 text-brand-700 border-brand-200"
                        )}>
                            {quote.status}
                        </span>
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 group"
                            title="Version History"
                        >
                            <History className={clsx("h-5 w-5", showHistory && "text-brand-600")} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 space-y-6 overflow-y-auto pr-2">
                    {/* Stock Detail Banner */}
                    {declaration && (
                        <div className={clsx(
                            "p-4 rounded-xl border flex items-center justify-between",
                            declaration.status === 'breached' ? "bg-red-50 border-red-100 text-red-900" : "bg-brand-50 border-brand-100 text-brand-900"
                        )}>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                    {declaration.status === 'verified' ? <ShieldCheck className="h-6 w-6 text-emerald-500" /> : <AlertCircle className="h-6 w-6" />}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Fulfillment Commitment</p>
                                    <p className="text-sm font-bold">
                                        {declaration.mode === 'in_stock' ? `Unit Verified (VIN: ${declaration.vin})` :
                                            declaration.mode === 'incoming' ? `Allocation ETA: ${declaration.eta}` :
                                                'Advance Order (Fulfillment Pending)'}
                                    </p>
                                </div>
                            </div>
                            {declaration.status === 'breached' && (
                                <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase shadow-lg shadow-red-100">Deadline Breached</span>
                            )}
                        </div>
                    )}

                    {/* Edit Limits Warning */}
                    {canEdit && (
                        <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-100 rounded-xl text-orange-800 text-sm">
                            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                            <div>
                                <p className="font-bold">Revision Tracking Active</p>
                                <p>You have used {quote.editCount} of {quote.maxEdits} available revisions for this quote.</p>
                            </div>
                        </div>
                    )}

                    {isLocked && (
                        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-xl text-green-800 text-sm">
                            <ShieldCheck className="h-5 w-5 flex-shrink-0" />
                            <div>
                                <p className="font-bold">Price Locked</p>
                                <p>This quote is immutable and has been sent to the customer.</p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Total Price ($)</label>
                            <input
                                type="number"
                                disabled={!canEdit}
                                value={formData.price}
                                onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-brand-500 outline-none disabled:bg-gray-50 disabled:text-gray-400"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Delivery Lead Time (Days)</label>
                            <input
                                type="number"
                                disabled={!canEdit}
                                value={formData.deliveryDays}
                                onChange={(e) => setFormData(prev => ({ ...prev, deliveryDays: Number(e.target.value) }))}
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-brand-500 outline-none disabled:bg-gray-50 disabled:text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Terms & Conditions</label>
                        <textarea
                            disabled={!canEdit}
                            value={formData.terms}
                            onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
                            className="w-full h-40 p-4 border rounded-xl focus:ring-2 focus:ring-brand-500 outline-none resize-none disabled:bg-gray-50 disabled:text-gray-400"
                        />
                    </div>
                </div>

                <div className="pt-6 border-t flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 border rounded-xl font-bold text-gray-600 hover:bg-gray-50"
                    >
                        Close
                    </button>

                    {canEdit && (
                        <>
                            <button
                                onClick={handleSave}
                                className="flex-1 bg-white border-2 border-brand-500 text-brand-600 px-6 py-3 rounded-xl font-bold hover:bg-brand-50 flex items-center justify-center gap-2"
                            >
                                <Save className="h-5 w-5" />
                                Save Revision
                            </button>
                            <button
                                onClick={() => setShowLockConfirm(true)}
                                className="flex-[1.5] bg-brand-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-700 flex items-center justify-center gap-2 shadow-lg shadow-brand-100"
                            >
                                <Lock className="h-5 w-5" />
                                Submit & Lock Price
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Side Panel: Version History */}
            <div className={clsx(
                "bg-gray-50 border-l w-80 transition-all duration-300 overflow-y-auto",
                showHistory ? "translate-x-0" : "translate-x-full fixed right-0 opacity-0 pointer-events-none"
            )}>
                <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <History className="h-5 w-5 text-gray-400" />
                        Revision History
                    </h3>
                    <div className="space-y-4">
                        {quote.versions.slice().reverse().map((v) => (
                            <div key={v.id} className="bg-white p-4 rounded-xl border border-gray-200 text-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-gray-900">v{v.versionNumber}</span>
                                    <span className="text-[10px] text-gray-400 uppercase font-black">
                                        {new Date(v.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="space-y-1 text-gray-600">
                                    <p>Price: <span className="font-bold text-gray-900">${v.price}</span></p>
                                    <p>Lead: {v.deliveryDays} days</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Lock Confirmation Modal Layer */}
            {showLockConfirm && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl space-y-6 text-center animate-in zoom-in duration-200">
                        <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="h-8 w-8 text-brand-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Confirm Price Lock</h3>
                        <p className="text-gray-500">
                            Locking this quote will make it **immediately visible** to the customer. You will NOT be able to make any further edits.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowLockConfirm(false)}
                                className="flex-1 py-3 font-bold text-gray-400 hover:text-gray-600"
                            >
                                No, Keep Drafting
                            </button>
                            <button
                                onClick={handleLock}
                                className="flex-1 bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 shadow-md"
                            >
                                Yes, Lock & Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
