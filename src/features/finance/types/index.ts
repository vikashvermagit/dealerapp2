export type TransactionType = 'credit_purchase' | 'invitation_join' | 'subscription_fee' | 'addon_purchase' | 'penalty';

export interface LedgerEntry {
    id: string;
    type: TransactionType;
    amount: number; // Positive for additions, negative for deductions
    description: string;
    timestamp: string;
    balanceAfter: number;
    referenceId?: string; // e.g. Order ID or Invoice ID
}

export interface Subscription {
    plan: 'Basic' | 'Pro' | 'Enterprise';
    status: 'active' | 'past_due' | 'canceled';
    expiresAt: string;
    autoRenew: boolean;
}

export interface Invoice {
    id: string;
    date: string;
    amount: number;
    status: 'paid' | 'unpaid';
    downloadUrl: string;
}

export interface FinancialStore {
    balance: number;
    ledger: LedgerEntry[];
    subscription: Subscription;
    invoices: Invoice[];
    addTransaction: (type: TransactionType, amount: number, description: string, referenceId?: string) => void;
    renewSubscription: () => void;
}
