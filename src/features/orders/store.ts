import { create } from 'zustand';
import type { Order, OrderStatus } from './types';

interface OrderState {
    orders: Order[];
    updateChecklist: (orderId: string, itemId: string, completed: boolean) => void;
    uploadDocument: (orderId: string, docName: string, url: string) => void;
    updateStatus: (orderId: string, status: OrderStatus) => void;
    verifyOtp: (orderId: string, otp: string) => boolean;
}

const MOCK_ORDERS: Order[] = [
    {
        id: 'ord-1',
        quoteId: 'quote-1',
        customerName: 'John Doe',
        vehicleModel: 'Toyota Camry 2024',
        status: 'checklist_pending',
        checklist: [
            { id: 'c1', label: 'Identity Proof Verified', completed: false },
            { id: 'c2', label: 'Payment Receipt Confirmed', completed: false },
            { id: 'c3', label: 'Insurance Policy Issued', completed: false },
        ],
        documents: [],
        otpVerified: false,
        deliveryOtp: '123456',
        timeline: [
            { status: 'checklist_pending', timestamp: new Date().toISOString(), description: 'Order created, awaiting checklist verification.' }
        ]
    }
];

export const useOrderStore = create<OrderState>((set, get) => ({
    orders: MOCK_ORDERS,

    updateChecklist: (orderId, itemId, completed) => set(state => ({
        orders: state.orders.map(o =>
            o.id === orderId
                ? {
                    ...o,
                    checklist: o.checklist.map(ci => ci.id === itemId ? { ...ci, completed } : ci)
                }
                : o
        )
    })),

    uploadDocument: (orderId, docName, url) => set(state => ({
        orders: state.orders.map(o => {
            if (o.id !== orderId) return o;

            const existingDocIndex = o.documents.findIndex(d => d.name === docName);
            const newDocs = [...o.documents];

            if (existingDocIndex > -1) {
                const doc = newDocs[existingDocIndex];
                newDocs[existingDocIndex] = {
                    ...doc,
                    versions: [
                        ...doc.versions,
                        { versionNumber: doc.versions.length + 1, url, uploadedAt: new Date().toISOString() }
                    ]
                };
            } else {
                newDocs.push({
                    id: crypto.randomUUID(),
                    name: docName,
                    versions: [{ versionNumber: 1, url, uploadedAt: new Date().toISOString() }]
                });
            }

            return { ...o, documents: newDocs };
        })
    })),

    updateStatus: (orderId, status) => set(state => {
        const order = state.orders.find(o => o.id === orderId);
        if (!order) return state;

        // Rule: Cannot leave checklist_pending if checklist is not all completed
        if (order.status === 'checklist_pending' && status !== 'cancelled') {
            const allDone = order.checklist.every(ci => ci.completed);
            if (!allDone) return state;
        }

        return {
            orders: state.orders.map(o =>
                o.id === orderId
                    ? {
                        ...o,
                        status,
                        timeline: [...o.timeline, {
                            status,
                            timestamp: new Date().toISOString(),
                            description: `Status changed to ${status.replace(/_/g, ' ')}.`
                        }]
                    }
                    : o
            )
        };
    }),

    verifyOtp: (orderId, otp) => {
        const state = get();
        const order = state.orders.find(o => o.id === orderId);
        if (order && order.deliveryOtp === otp) {
            set({
                orders: state.orders.map(o =>
                    o.id === orderId ? { ...o, otpVerified: true, status: 'delivered' as OrderStatus } : o
                )
            });
            return true;
        }
        return false;
    }
}));
