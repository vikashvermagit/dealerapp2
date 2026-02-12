import React, { useState } from 'react';
import { useStockStore } from '../store';
import type { StockMode } from '../types';
import {
    Car,
    Calendar,
    Ship,
    ShieldCheck,
    AlertCircle,
    ArrowRight
} from 'lucide-react';
import clsx from 'clsx';

interface StockSelectorProps {
    invitationId: string;
    onComplete: () => void;
    onCancel: () => void;
}

export const StockSelector: React.FC<StockSelectorProps> = ({ invitationId, onComplete, onCancel }) => {
    const { declareStock } = useStockStore();
    const [mode, setMode] = useState<StockMode | null>(null);
    const [vin, setVin] = useState('');
    const [eta, setEta] = useState('');
    const [vinDeadline, setVinDeadline] = useState('');
    const [buyerConsent, setBuyerConsent] = useState(false);

    const isStep2Valid = () => {
        if (mode === 'in_stock') return vin.length === 17;
        if (mode === 'incoming') return !!eta && !!vinDeadline;
        if (mode === 'advance_order') return buyerConsent;
        return false;
    };

    const handleConfirm = () => {
        if (!mode) return;

        declareStock(invitationId, {
            mode,
            vin: mode === 'in_stock' ? vin : undefined,
            eta: mode === 'incoming' ? eta : undefined,
            vinDeadline: mode === 'incoming' ? vinDeadline : undefined,
            buyerConsentRequired: mode === 'advance_order'
        });

        onComplete();
    };

    return (
        <div className="bg-white rounded-[2rem] border border-gray-100 p-10 max-w-2xl w-full shadow-2xl space-y-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Stock Declaration</h3>
                    <p className="text-gray-500 mt-1 font-medium">Mandatory inventory commitment before quoting.</p>
                </div>
                <div className="p-3 bg-brand-50 rounded-2xl text-brand-600">
                    <ShieldCheck className="h-6 w-6" />
                </div>
            </div>

            {/* Mode Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { id: 'in_stock', label: 'In-Stock', sub: 'VIN Ready', icon: Car, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { id: 'incoming', label: 'Incoming', sub: 'ETA Known', icon: Ship, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { id: 'advance_order', label: 'Advance', sub: 'Custom Order', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' }
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setMode(item.id as StockMode)}
                        className={clsx(
                            "p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 text-center group",
                            mode === item.id
                                ? "border-brand-500 bg-brand-50/20 shadow-lg shadow-brand-100"
                                : "border-gray-100 bg-white hover:border-brand-200"
                        )}
                    >
                        <div className={clsx("p-3 rounded-xl transition-transform group-hover:scale-110", item.bg, item.color)}>
                            <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{item.label}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.sub}</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Mode Specific Fields */}
            {mode && (
                <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100 space-y-6 animate-in fade-in slide-in-from-top-4">
                    {mode === 'in_stock' && (
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Verification Identification Number (VIN)</label>
                            <input
                                type="text"
                                value={vin}
                                maxLength={17}
                                onChange={(e) => setVin(e.target.value.toUpperCase())}
                                placeholder="ENTER 17-DIGIT VIN"
                                className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-brand-500 transition-all font-mono font-bold tracking-widest"
                            />
                            {vin.length > 0 && vin.length < 17 && (
                                <p className="text-xs text-orange-500 flex items-center gap-2">
                                    <AlertCircle className="h-3 w-3" />
                                    VIN must be exactly 17 characters.
                                </p>
                            )}
                        </div>
                    )}

                    {mode === 'incoming' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Planned ETA</label>
                                <input
                                    type="date"
                                    value={eta}
                                    onChange={(e) => setEta(e.target.value)}
                                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-brand-500 transition-all font-bold"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">VIN Issuance Deadline</label>
                                <input
                                    type="date"
                                    value={vinDeadline}
                                    onChange={(e) => setVinDeadline(e.target.value)}
                                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-brand-500 transition-all font-bold"
                                />
                            </div>
                        </div>
                    )}

                    {mode === 'advance_order' && (
                        <div className="space-y-6">
                            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 flex items-start gap-4">
                                <AlertCircle className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                                <p className="text-xs text-purple-700 leading-relaxed font-medium">
                                    Advance orders require explicit buyer consent before the VIN is issued. Please confirm you have obtained the necessary dealership authorization.
                                </p>
                            </div>
                            <label className="flex items-center gap-4 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={buyerConsent}
                                    onChange={(e) => setBuyerConsent(e.target.checked)}
                                    className="w-5 h-5 rounded-lg text-brand-500 border-gray-300 focus:ring-brand-500"
                                />
                                <span className="text-sm font-bold text-gray-700">I acknowledge that buyer consent is mandatory.</span>
                            </label>
                        </div>
                    )}
                </div>
            )}

            <div className="flex gap-4 pt-4 border-t border-gray-100">
                <button
                    onClick={onCancel}
                    className="flex-1 py-4 font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest text-xs"
                >
                    Cancel
                </button>
                <button
                    disabled={!isStep2Valid()}
                    onClick={handleConfirm}
                    className={clsx(
                        "flex-1 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95",
                        isStep2Valid()
                            ? "bg-brand-500 text-white shadow-brand-100 hover:bg-brand-600"
                            : "bg-gray-100 text-gray-300 cursor-not-allowed"
                    )}
                >
                    Lock Declaration
                    <ArrowRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};
