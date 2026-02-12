import { useState } from 'react';
import { useOrderStore } from '../store';
import {
    OrderChecklist,
    DocumentManager,
    DeliveryTimeline
} from '../components/OrderControls';
import {
    PackageSearch,
    Truck,
    ShieldCheck,
    ChevronRight,
    AlertCircle
} from 'lucide-react';
import clsx from 'clsx';

export const OrdersPage = () => {
    const { orders, updateStatus, verifyOtp } = useOrderStore();
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [otpValue, setOtpValue] = useState('');
    const [otpError, setOtpError] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);

    const activeOrder = orders.find(o => o.id === selectedOrderId);

    const handleTransition = (order: any, nextStatus: string) => {
        if (order.status === 'checklist_pending') {
            const allDone = order.checklist.every((ci: any) => ci.completed);
            if (!allDone) {
                alert('All checklist items must be verified before processing.');
                return;
            }
        }
        updateStatus(order.id, nextStatus as any);
    };

    const handleOtpVerify = () => {
        if (activeOrder) {
            const success = verifyOtp(activeOrder.id, otpValue);
            if (success) {
                setShowOtpModal(false);
                setOtpValue('');
                setOtpError(false);
            } else {
                setOtpError(true);
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Post-Win Orders</h1>
                <p className="text-gray-500 mt-1">Manage fulfillment, documents, and final delivery.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Orders List Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">Active Orders</h2>
                    {orders.map(order => (
                        <button
                            key={order.id}
                            onClick={() => setSelectedOrderId(order.id)}
                            className={clsx(
                                "w-full text-left p-5 rounded-2xl border transition-all relative overflow-hidden",
                                selectedOrderId === order.id
                                    ? "bg-white border-brand-500 shadow-xl shadow-brand-100 ring-1 ring-brand-500"
                                    : "bg-white border-gray-100 hover:border-gray-300 shadow-sm"
                            )}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-[10px] font-black text-brand-600 bg-brand-50 px-2 py-1 rounded">ID: {order.id}</span>
                                <span className={clsx(
                                    "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded",
                                    order.status === 'delivered' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                                )}>
                                    {order.status.replace(/_/g, ' ')}
                                </span>
                            </div>
                            <h3 className="font-bold text-gray-900 group-hover:text-brand-600 transition-colors uppercase tracking-tight">{order.customerName}</h3>
                            <p className="text-xs text-gray-500 mt-1">{order.vehicleModel}</p>

                            {selectedOrderId === order.id && (
                                <div className="absolute right-0 bottom-0 top-0 w-1 bg-brand-500" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Order Details Pane */}
                <div className="lg:col-span-2 space-y-6">
                    {activeOrder ? (
                        <div className="space-y-6">
                            {/* Actions Header */}
                            <div className="bg-white p-6 rounded-2xl border flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="bg-brand-500 p-3 rounded-xl text-white shadow-lg shadow-brand-200">
                                        <Truck className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-brand-600 uppercase tracking-widest">Next Step</p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {activeOrder.status === 'checklist_pending' && 'Complete Fulfillment Checklist'}
                                            {activeOrder.status === 'processing' && 'Dispatch for Delivery'}
                                            {activeOrder.status === 'out_for_delivery' && 'Verify Delivery OTP'}
                                            {activeOrder.status === 'delivered' && 'Order Completed!'}
                                        </p>
                                    </div>
                                </div>

                                {activeOrder.status !== 'delivered' && (
                                    <button
                                        onClick={() => {
                                            if (activeOrder.status === 'out_for_delivery') {
                                                setShowOtpModal(true);
                                            } else {
                                                const sequence: Record<string, string> = {
                                                    'checklist_pending': 'processing',
                                                    'processing': 'out_for_delivery'
                                                };
                                                handleTransition(activeOrder, sequence[activeOrder.status]);
                                            }
                                        }}
                                        className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-600 transition-all shadow-md active:scale-95"
                                    >
                                        {activeOrder.status === 'out_for_delivery' ? 'Verify OTP' : 'Proceed'}
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <OrderChecklist order={activeOrder} />
                                <DocumentManager order={activeOrder} />
                            </div>

                            <DeliveryTimeline order={activeOrder} />
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 h-96 flex flex-col items-center justify-center text-center p-12">
                            <PackageSearch className="h-16 w-16 text-gray-300 mb-4" />
                            <h3 className="text-xl font-bold text-gray-400">Select an order to view details</h3>
                            <p className="text-gray-400 max-w-xs mt-2">Manage documentation, tracking, and handovers in one place.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* OTP Verification Modal */}
            {showOtpModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-8 text-center">
                        <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto ring-8 ring-brand-50/50">
                            <ShieldCheck className="h-10 w-10 text-brand-600" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Delivery Verification</h3>
                            <p className="text-gray-500 mt-2 text-sm">
                                Enter the 6-digit OTP sent to **{activeOrder?.customerName}** to complete the handover.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                maxLength={6}
                                value={otpValue}
                                onChange={(e) => setOtpValue(e.target.value)}
                                placeholder="0 0 0 0 0 0"
                                className={clsx(
                                    "w-full text-center text-4xl font-black tracking-[1em] p-4 bg-gray-50 border-2 rounded-2xl outline-none focus:bg-white transition-all",
                                    otpError ? "border-red-300 ring-4 ring-red-50" : "border-gray-100 focus:border-brand-500"
                                )}
                            />
                            {otpError && (
                                <p className="text-red-600 text-xs font-bold flex items-center justify-center gap-1 animate-bounce">
                                    <AlertCircle className="h-3 w-3" />
                                    Invalid OTP. Please check with customer.
                                </p>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setShowOtpModal(false);
                                    setOtpError(false);
                                    setOtpValue('');
                                }}
                                className="flex-1 py-4 font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest text-xs"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleOtpVerify}
                                disabled={otpValue.length < 6}
                                className="flex-[2] bg-brand-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-brand-100 hover:bg-brand-700 transition-all disabled:opacity-50 disabled:grayscale"
                            >
                                Confirm Delivery
                            </button>
                        </div>

                        <div className="pt-4 border-t border-dashed">
                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                                Handover ID: {activeOrder?.id && btoa(activeOrder.id).slice(0, 12)}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
