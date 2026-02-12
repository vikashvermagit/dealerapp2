import { useState } from 'react';
import { useOrderStore } from '../store';
import {
    CheckCircle2,
    Circle,
    FileUp,
    Truck,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import clsx from 'clsx';
import type { Order } from '../types';

// --- Checklist Component ---
export const OrderChecklist = ({ order }: { order: Order }) => {
    const { updateChecklist } = useOrderStore();

    return (
        <div className="bg-white rounded-xl border p-5 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-500" />
                Fulfillment Checklist
            </h3>
            <div className="space-y-2">
                {order.checklist.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => updateChecklist(order.id, item.id, !item.completed)}
                        className={clsx(
                            "w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                            item.completed ? "bg-brand-50 border-brand-200" : "bg-white border-gray-100 hover:border-gray-300 shadow-sm"
                        )}
                    >
                        {item.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-brand-600" />
                        ) : (
                            <Circle className="h-5 w-5 text-gray-300" />
                        )}
                        <span className={clsx("text-sm font-medium", item.completed ? "text-brand-900" : "text-gray-700")}>
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

// --- Document version manager ---
export const DocumentManager = ({ order }: { order: Order }) => {
    const { uploadDocument } = useOrderStore();
    const [openDoc, setOpenDoc] = useState<string | null>(null);

    const handleUpload = (name: string) => {
        // Simulate upload
        const url = `https://storage.example.com/${name}-${Date.now()}.pdf`;
        uploadDocument(order.id, name, url);
    };

    const requiredDocs = ['Sales Agreement', 'Insurance Policy', 'Vehicle Registration'];

    return (
        <div className="bg-white rounded-xl border p-5 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <FileUp className="h-4 w-4 text-brand-500" />
                Document versions
            </h3>
            <div className="space-y-3">
                {requiredDocs.map(docName => {
                    const doc = order.documents.find(d => d.name === docName);
                    const isExpanded = openDoc === docName;

                    return (
                        <div key={docName} className="border rounded-lg overflow-hidden bg-gray-50">
                            <div className="p-3 flex items-center justify-between bg-white border-b">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-900">{docName}</span>
                                    <span className="text-[10px] text-gray-400">
                                        {doc ? `${doc.versions.length} versions` : 'No upload yet'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleUpload(docName)}
                                        className="p-1.5 hover:bg-brand-50 text-brand-600 rounded-md transition-colors"
                                        title="Upload New Version"
                                    >
                                        <FileUp className="h-4 w-4" />
                                    </button>
                                    {doc && (
                                        <button
                                            onClick={() => setOpenDoc(isExpanded ? null : docName)}
                                            className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400 transition-colors"
                                        >
                                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {isExpanded && doc && (
                                <div className="p-3 space-y-2 max-h-40 overflow-y-auto">
                                    {doc.versions.slice().reverse().map(v => (
                                        <div key={v.versionNumber} className="flex justify-between items-center bg-white p-2 rounded border text-xs">
                                            <span className="font-bold text-gray-600">v{v.versionNumber}</span>
                                            <span className="text-gray-400">{new Date(v.uploadedAt).toLocaleDateString()}</span>
                                            <a href={v.url} target="_blank" className="text-brand-600 font-bold hover:underline">View</a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- Timeline Component ---
export const DeliveryTimeline = ({ order }: { order: Order }) => {
    return (
        <div className="bg-white rounded-xl border p-5 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <Truck className="h-4 w-4 text-brand-500" />
                Tracking Timeline
            </h3>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                {order.timeline.slice().reverse().map((step, idx) => (
                    <div key={idx} className="relative">
                        <div className={clsx(
                            "absolute -left-[1.375rem] top-1 h-3 w-3 rounded-full border-2 bg-white",
                            idx === 0 ? "border-brand-500 shadow-[0_0_0_4px_rgba(14,165,233,0.1)]" : "border-gray-200"
                        )} />
                        <p className={clsx(
                            "text-xs font-black uppercase tracking-widest",
                            idx === 0 ? "text-brand-600" : "text-gray-400"
                        )}>
                            {step.status.replace(/_/g, ' ')}
                        </p>
                        <p className="text-sm font-medium text-gray-900 mt-0.5">{step.description}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{new Date(step.timestamp).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
