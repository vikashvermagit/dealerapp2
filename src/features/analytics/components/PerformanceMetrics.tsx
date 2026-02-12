import { TrendingDown, TrendingUp, AlertCircle, Zap } from 'lucide-react';
import { useAnalyticsStore } from '../store';
import clsx from 'clsx';

export const PerformanceMetrics = () => {
    const { getCompetitivenessData, getSLAMetrics, exportData } = useAnalyticsStore();
    const comp = getCompetitivenessData();
    const sla = getSLAMetrics();

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Competitiveness Index */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-8 border-b flex justify-between items-center bg-gray-50/30">
                    <h3 className="font-black text-gray-900 uppercase tracking-tight text-lg flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-brand-500" />
                        Price Competitiveness
                    </h3>
                    <button onClick={() => exportData('performance')} className="text-[10px] font-black text-brand-600 uppercase tracking-widest hover:underline">Export</button>
                </div>

                <div className="p-8 flex-1 flex flex-col justify-center items-center gap-6">
                    <div className="relative w-40 h-40 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                            <circle cx="80" cy="80" r="70" fill="none" stroke="#f3f4f6" strokeWidth="12" />
                            <circle
                                cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="12"
                                strokeDasharray={440}
                                strokeDashoffset={440 - (440 * comp.index / 100)}
                                className={clsx(
                                    "transition-all duration-1000",
                                    comp.index > 70 ? "text-emerald-500" : comp.index > 40 ? "text-orange-500" : "text-red-500"
                                )}
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-4xl font-black text-gray-900">{comp.index.toFixed(0)}</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Index</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 w-full">
                        <div className="text-center group">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Your Avg Price</p>
                            <p className="text-xl font-black text-gray-900 mt-1">${comp.dealerAvgPrice.toLocaleString()}</p>
                            {comp.dealerAvgPrice < comp.marketAvgPrice ? (
                                <div className="mt-1 flex items-center justify-center gap-1 text-[10px] font-bold text-emerald-600">
                                    <TrendingDown className="h-3 w-3" />
                                    Competitive
                                </div>
                            ) : (
                                <div className="mt-1 flex items-center justify-center gap-1 text-[10px] font-bold text-red-600">
                                    <TrendingUp className="h-3 w-3" />
                                    Above Market
                                </div>
                            )}
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Market Avg</p>
                            <p className="text-xl font-black text-gray-900 mt-1">${comp.marketAvgPrice.toLocaleString()}</p>
                            <p className="text-[10px] font-bold text-gray-300 mt-1 uppercase tracking-widest">Anonymized Data</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SLA Performance */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-8 border-b flex justify-between items-center bg-gray-50/30">
                    <h3 className="font-black text-gray-900 uppercase tracking-tight text-lg flex items-center gap-3">
                        <Zap className="h-5 w-5 text-orange-400" />
                        Response Velocity (SLA)
                    </h3>
                    <button onClick={() => exportData('sla')} className="text-[10px] font-black text-brand-600 uppercase tracking-widest hover:underline">Export</button>
                </div>

                <div className="p-8 space-y-8">
                    {[
                        { label: 'Avg Join Time', value: sla.avgJoinTime, breaches: sla.breaches.join, unit: 'm', threshold: 30 },
                        { label: 'Avg Quote Time', value: sla.avgQuoteTime, breaches: sla.breaches.quote, unit: 'm', threshold: 60 },
                        { label: 'Avg Lock Time', value: sla.avgLockTime, breaches: sla.breaches.lock, unit: 'h', threshold: 24 },
                    ].map((metric, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-transparent hover:border-gray-100 transition-all">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{metric.label}</p>
                                <p className="text-2xl font-black text-gray-900">{metric.value.toFixed(1)}{metric.unit}</p>
                            </div>
                            <div className="text-right">
                                <div className={clsx(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-sm",
                                    metric.breaches > 0 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                                )}>
                                    {metric.breaches > 0 && <AlertCircle className="h-3 w-3" />}
                                    {metric.breaches > 0 ? `${metric.breaches} Breaches` : 'SLA Healthy'}
                                </div>
                                <p className="text-[9px] text-gray-400 mt-2 font-black uppercase tracking-widest">Limit: {metric.threshold}{metric.unit}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
