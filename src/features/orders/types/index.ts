export type OrderStatus = 'checklist_pending' | 'processing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface ChecklistItem {
    id: string;
    label: string;
    completed: boolean;
}

export interface OrderDocument {
    id: string;
    name: string;
    versions: Array<{
        versionNumber: number;
        url: string;
        uploadedAt: string;
    }>;
}

export interface Order {
    id: string;
    quoteId: string;
    customerName: string;
    vehicleModel: string;
    status: OrderStatus;
    checklist: ChecklistItem[];
    documents: OrderDocument[];
    deliveryOtp?: string;
    otpVerified: boolean;
    timeline: Array<{
        status: OrderStatus;
        timestamp: string;
        description: string;
    }>;
}

export interface OrderStore {
    orders: Order[];
    updateChecklist: (orderId: string, itemId: string, completed: boolean) => void;
    uploadDocument: (orderId: string, docName: string, url: string) => void;
    updateStatus: (orderId: string, status: OrderStatus) => void;
    verifyOtp: (orderId: string, otp: string) => boolean;
}
