import { BarChart3, TrendingUp, Info } from 'lucide-react';
import { AnalyticsFilters } from '../components/AnalyticsFilters';
import { FunnelReport } from '../components/FunnelReport';
import { PerformanceMetrics } from '../components/PerformanceMetrics';

export const AnalyticsPage = () => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                    <BarChart3 className="h-8 w-8 text-brand-500" />
                    Reports & Analytics
                </h1>
                <p className="text-gray-500 mt-1 uppercase text-[10px] font-black tracking-widest">Enterprise Performance Intelligence</p>
            </div>

            {/* Global Filters */}
            <AnalyticsFilters />

            {/* Stats Summary Tooltip/Banner */}
            <div className="bg-brand-500 p-6 rounded-[2rem] text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl shadow-brand-100/50">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-2xl">
                        <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                        <h4 className="font-black text-lg uppercase tracking-tight">Active Growth Phase</h4>
                        <p className="text-brand-100 text-xs font-medium">Your quote-to-win conversion is up by 12.4% this month.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5">
                    <Info className="h-4 w-4" />
                    Market data updated 4h ago
                </div>
            </div>

            {/* Funnel Report */}
            <FunnelReport />

            {/* Competitiveness & SLA */}
            <PerformanceMetrics />

            {/* Disclaimer */}
            <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest py-8">
                All competitor pricing is anonymized and aggregated. No individual dealer data leakage.
            </p>
        </div>
    );
};
