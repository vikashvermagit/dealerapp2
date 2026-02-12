import { create } from 'zustand';
import type { FinancialStore, LedgerEntry, TransactionType } from './types';

export const useFinanceStore = create<FinancialStore>((set, get) => ({
    balance: 5000,
    ledger: [
        {
            id: 'tx-1',
            type: 'credit_purchase',
            amount: 5000,
            description: 'Initial wallet top-up',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
            balanceAfter: 5000,
        }
    ],
    subscription: {
        plan: 'Pro',
        status: 'active',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString(),
        autoRenew: true,
    },
    invoices: [
        {
            id: 'INV-2024-001',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
            amount: 500,
            status: 'paid',
            downloadUrl: '#',
        }
    ],

    addTransaction: (type: TransactionType, amount: number, description: string, referenceId?: string) => {
        const currentBalance = get().balance;
        const newBalance = currentBalance + amount;

        const newEntry: LedgerEntry = {
            id: `tx-${crypto.randomUUID()}`,
            type,
            amount,
            description,
            timestamp: new Date().toISOString(),
            balanceAfter: newBalance,
            referenceId,
        };

        set({
            balance: newBalance,
            ledger: [newEntry, ...get().ledger], // Prepend to show newest first
        });
    },

    renewSubscription: () => {
        const { subscription } = get();
        set({
            subscription: {
                ...subscription,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
            }
        });
    }
}));
