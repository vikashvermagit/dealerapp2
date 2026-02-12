import { create } from 'zustand';
import type { AnalyticsStore } from './types';

// Mock Historical Events to drive data-driven reports
const HISTORICAL_EVENTS = [
    { id: '1', date: '2024-01-01', type: 'invite', brand: 'Toyota', city: 'London' },
    { id: '1', date: '2024-01-01', type: 'join', brand: 'Toyota', city: 'London', timeToJoin: 15 },
    { id: '1', date: '2024-01-02', type: 'quote', brand: 'Toyota', city: 'London', price: 34000, marketPrice: 34500, timeToQuote: 120 },
    { id: '1', date: '2024-01-03', type: 'win', brand: 'Toyota', city: 'London', timeToLock: 45 },

    { id: '2', date: '2024-01-05', type: 'invite', brand: 'Tesla', city: 'Manchester' },
    { id: '2', date: '2024-01-05', type: 'join', brand: 'Tesla', city: 'Manchester', timeToJoin: 45 },
    { id: '2', date: '2024-01-06', type: 'quote', brand: 'Tesla', city: 'Manchester', price: 48000, marketPrice: 47000, timeToQuote: 300 },

    { id: '3', date: '2024-01-10', type: 'invite', brand: 'Ford', city: 'London' },
    { id: '3', date: '2024-01-11', type: 'join', brand: 'Ford', city: 'London', timeToJoin: 240 },
    { id: '3', date: '2024-01-11', type: 'quote', brand: 'Ford', city: 'London', price: 52000, marketPrice: 53000, timeToQuote: 50 },
    { id: '3', date: '2024-01-12', type: 'win', brand: 'Ford', city: 'London', timeToLock: 10 },
];

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
    filters: {
        dateRange: {
            start: '2024-01-01',
            end: '2024-12-31',
        }
    },

    setFilters: (newFilters) => set(state => ({
        filters: { ...state.filters, ...newFilters }
    })),

    getFunnelData: () => {
        const { filters } = get();
        const filtered = HISTORICAL_EVENTS.filter(e => {
            const dateMatch = e.date >= filters.dateRange.start && e.date <= filters.dateRange.end;
            const brandMatch = !filters.brand || e.brand === filters.brand;
            const cityMatch = !filters.city || e.city === filters.city;
            return dateMatch && brandMatch && cityMatch;
        });

        const invites = new Set(filtered.filter(e => e.type === 'invite').map(e => e.id)).size;
        const joins = new Set(filtered.filter(e => e.type === 'join').map(e => e.id)).size;
        const quotes = new Set(filtered.filter(e => e.type === 'quote').map(e => e.id)).size;
        const wins = new Set(filtered.filter(e => e.type === 'win').map(e => e.id)).size;

        return {
            invites,
            joins,
            quotes,
            wins,
            conversionRates: {
                inviteToJoin: invites ? (joins / invites) * 100 : 0,
                joinToQuote: joins ? (quotes / joins) * 100 : 0,
                quoteToWin: quotes ? (wins / quotes) * 100 : 0,
                overall: invites ? (wins / invites) * 100 : 0
            }
        };
    },

    getCompetitivenessData: () => {
        const { filters } = get();
        const quotes = HISTORICAL_EVENTS.filter(e =>
            e.type === 'quote' &&
            e.date >= filters.dateRange.start &&
            e.date <= filters.dateRange.end &&
            (!filters.brand || e.brand === filters.brand) &&
            (!filters.city || e.city === filters.city)
        ) as any[];

        const dealerAvg = quotes.reduce((acc, q) => acc + q.price, 0) / (quotes.length || 1);
        const marketAvg = quotes.reduce((acc, q) => acc + q.marketPrice, 0) / (quotes.length || 1);

        // Lower is better (more competitive) - simple index calculation
        const index = Math.max(0, 100 - ((dealerAvg / marketAvg) - 1) * 100);

        return {
            dealerAvgPrice: dealerAvg,
            marketAvgPrice: marketAvg,
            index: Math.min(100, index),
            trend: quotes.map(q => ({
                date: q.date,
                price: q.price,
                marketPrice: q.marketPrice
            }))
        };
    },

    getSLAMetrics: () => {
        const { filters } = get();
        const events = HISTORICAL_EVENTS.filter(e =>
            e.date >= filters.dateRange.start && e.date <= filters.dateRange.end &&
            (!filters.brand || e.brand === filters.brand) &&
            (!filters.city || e.city === filters.city)
        ) as any[];

        const joinTimes = events.filter(e => e.type === 'join').map(e => e.timeToJoin);
        const quoteTimes = events.filter(e => e.type === 'quote').map(e => e.timeToQuote);
        const lockTimes = events.filter(e => e.type === 'win').map(e => e.timeToLock);

        const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

        // Arbitrary thresholds for breaches
        const thresholds = { join: 30, quote: 60, lock: 20 };

        return {
            avgJoinTime: avg(joinTimes),
            avgQuoteTime: avg(quoteTimes),
            avgLockTime: avg(lockTimes),
            breaches: {
                join: joinTimes.filter(t => t > thresholds.join).length,
                quote: quoteTimes.filter(t => t > thresholds.quote).length,
                lock: lockTimes.filter(t => t > thresholds.lock).length
            }
        };
    },

    exportData: (type) => {
        console.log(`Exporting ${type} data based on current filters...`);
        alert(`CSV Export dynamic generation for ${type.toUpperCase()} initiated successfully.`);
    }
}));
