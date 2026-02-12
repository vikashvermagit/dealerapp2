export type QuoteStatus = 'draft' | 'locked' | 'expired' | 'canceled';

export interface QuoteVersion {
    id: string;
    versionNumber: number;
    price: number;
    deliveryDays: number;
    terms: string;
    createdAt: string;
}

export interface Quote {
    id: string;
    invitationId: string;
    customerName: string;
    vehicleModel: string;
    status: QuoteStatus;
    currentVersionIndex: number;
    versions: QuoteVersion[];
    editCount: number;
    maxEdits: number;
    lockedAt?: string;
}

export interface QuoteStore {
    quotes: Quote[];
    createQuote: (invitationId: string, customerName: string, vehicleModel: string) => void;
    updateQuote: (quoteId: string, data: Partial<QuoteVersion>) => void;
    lockQuote: (quoteId: string) => void;
    getQuoteByInvitation: (invitationId: string) => Quote | undefined;
}
