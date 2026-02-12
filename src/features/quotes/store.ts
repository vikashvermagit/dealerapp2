import { create } from 'zustand';
import type { Quote, QuoteVersion } from './types';

interface QuoteState {
    quotes: Quote[];
    createQuote: (invitationId: string, customerName: string, vehicleModel: string) => void;
    updateQuote: (quoteId: string, data: Omit<QuoteVersion, 'id' | 'versionNumber' | 'createdAt'>) => void;
    lockQuote: (quoteId: string) => void;
}

export const useQuoteStore = create<QuoteState>((set, get) => ({
    quotes: [],

    createQuote: (invitationId, customerName, vehicleModel) => {
        const existing = get().quotes.find(q => q.invitationId === invitationId);
        if (existing) return;

        const initialVersion: QuoteVersion = {
            id: crypto.randomUUID(),
            versionNumber: 1,
            price: 0,
            deliveryDays: 7,
            terms: 'Standard terms apply.',
            createdAt: new Date().toISOString(),
        };

        const newQuote: Quote = {
            id: crypto.randomUUID(),
            invitationId,
            customerName,
            vehicleModel,
            status: 'draft',
            currentVersionIndex: 0,
            versions: [initialVersion],
            editCount: 0,
            maxEdits: 3,
        };

        set(state => ({ quotes: [...state.quotes, newQuote] }));
    },

    updateQuote: (quoteId, data) => set(state => {
        const quote = state.quotes.find(q => q.id === quoteId);
        if (!quote || quote.status !== 'draft' || quote.editCount >= quote.maxEdits) return state;

        const newVersion: QuoteVersion = {
            id: crypto.randomUUID(),
            versionNumber: quote.versions.length + 1,
            ...data,
            createdAt: new Date().toISOString(),
        };

        return {
            quotes: state.quotes.map(q =>
                q.id === quoteId
                    ? {
                        ...q,
                        versions: [...q.versions, newVersion],
                        currentVersionIndex: q.versions.length,
                        editCount: q.editCount + 1
                    }
                    : q
            )
        };
    }),

    lockQuote: (quoteId) => set(state => ({
        quotes: state.quotes.map(q =>
            q.id === quoteId
                ? { ...q, status: 'locked', lockedAt: new Date().toISOString() }
                : q
        )
    })),
}));
