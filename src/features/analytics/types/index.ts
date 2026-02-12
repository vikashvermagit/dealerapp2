export interface FunnelStats {
    invites: number;
    joins: number;
    quotes: number;
    wins: number;
    conversionRates: {
        inviteToJoin: number;
        joinToQuote: number;
        quoteToWin: number;
        overall: number;
    };
}

export interface CompetitivenessIndex {
    dealerAvgPrice: number;
    marketAvgPrice: number;
    index: number; // 0-100 score
    trend: {
        date: string;
        price: number;
        marketPrice: number;
    }[];
}

export interface SLAMetrics {
    avgJoinTime: number; // in minutes
    avgQuoteTime: number; // in minutes
    avgLockTime: number; // in minutes
    breaches: {
        join: number;
        quote: number;
        lock: number;
    };
}

export interface AnalyticsFilters {
    dateRange: {
        start: string;
        end: string;
    };
    brand?: string;
    city?: string;
}

export interface AnalyticsStore {
    filters: AnalyticsFilters;
    setFilters: (filters: Partial<AnalyticsFilters>) => void;
    getFunnelData: () => FunnelStats;
    getCompetitivenessData: () => CompetitivenessIndex;
    getSLAMetrics: () => SLAMetrics;
    exportData: (type: 'funnel' | 'performance' | 'sla') => void;
}
