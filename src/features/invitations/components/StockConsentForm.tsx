import React, { useState } from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface StockConsentFormProps {
    onComplete: () => void;
    onCancel: () => void;
}

export const StockConsentForm: React.FC<StockConsentFormProps> = ({ onComplete, onCancel }) => {
    const [consents, setConsents] = useState({
        stockAvailability: false,
        priceGuarantee: false,
        vinVerified: false,
    });

    const allSelected = consents.stockAvailability && consents.priceGuarantee && consents.vinVerified;

    return (
        <div className="bg-white rounded-xl border p-6 space-y-6 max-w-lg mx-auto shadow-sm">
            <div className="flex items-center gap-3 text-brand-600">
                <ShieldCheck className="h-8 w-8" />
                <h2 className="text-xl font-bold text-gray-900">Mandatory Stock Consent</h2>
            </div>

            <p className="text-sm text-gray-500">
                Before you can proceed to submit a quote, you must verify that you have the requested stock available and agree to the dealership terms.
            </p>

            <div className="space-y-4">
                <label className="flex items-start gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded text-brand-600 focus:ring-brand-500"
                        checked={consents.stockAvailability}
                        onChange={(e) => setConsents(prev => ({ ...prev, stockAvailability: e.target.checked }))}
                    />
                    <div className="text-sm">
                        <p className="font-semibold text-gray-900">Stock Availability</p>
                        <p className="text-gray-500 text-xs">I confirm this exact model or an equivalent is in our current inventory.</p>
                    </div>
                </label>

                <label className="flex items-start gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded text-brand-600 focus:ring-brand-500"
                        checked={consents.priceGuarantee}
                        onChange={(e) => setConsents(prev => ({ ...prev, priceGuarantee: e.target.checked }))}
                    />
                    <div className="text-sm">
                        <p className="font-semibold text-gray-900">Price Integrity</p>
                        <p className="text-gray-500 text-xs">I agree that the quoted price will be honored for at least 48 hours.</p>
                    </div>
                </label>

                <label className="flex items-start gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded text-brand-600 focus:ring-brand-500"
                        checked={consents.vinVerified}
                        onChange={(e) => setConsents(prev => ({ ...prev, vinVerified: e.target.checked }))}
                    />
                    <div className="text-sm">
                        <p className="font-semibold text-gray-900">VIN Verification</p>
                        <p className="text-gray-500 text-xs">I understand that a valid VIN must be provided once the customer expresses interest.</p>
                    </div>
                </label>
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    disabled={!allSelected}
                    onClick={onComplete}
                    className={clsx(
                        "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        allSelected
                            ? "bg-brand-600 text-white hover:bg-brand-700 shadow-md"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    )}
                >
                    Complete Consent
                </button>
            </div>

            {!allSelected && (
                <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 p-2 rounded border border-orange-100">
                    <AlertCircle className="h-4 w-4" />
                    <span>All items must be checked to proceed.</span>
                </div>
            )}
        </div>
    );
};
