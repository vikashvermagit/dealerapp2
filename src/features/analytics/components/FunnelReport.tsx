import { ArrowDown, Mail, Users, FileText, CheckCircle2, Download } from 'lucide-react';
import { useAnalyticsStore } from '../store';
import clsx from 'clsx';

export const FunnelReport = () => {
    const { getFunnelData, exportData } = useAnalyticsStore();
    const data = getFunnelData();

    const stages = [
        { label: 'Invitations', value: data.invites, icon: Mail, color: 'bg-blue-500' },
        { label: 'Joins', value: data.joins, rate: data.conversionRates.inviteToJoin, icon: Users, color: 'bg-indigo-500' },
        { label: 'Quotes', value: data.quotes, rate: data.conversionRates.joinToQuote, icon: FileText, color: 'bg-purple-500' },
        { label: 'Wins', value: data.wins, rate: data.conversionRates.quoteToWin, icon: CheckCircle2, color: 'bg-emerald-500' },
    ];

    return (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b flex justify-between items-center bg-gray-50/30">
                <h3 className="font-black text-gray-900 uppercase tracking-tight text-lg">Growth Funnel</h3>
                <button
                    onClick={() => exportData('funnel')}
                    className="flex items-center gap-2 text-[10px] font-black text-brand-600 uppercase tracking-widest hover:underline"
                >
                    <Download className="h-3 w-3" />
                    Export CSV
                </button>
            </div>

            <div className="p-10 space-y-12">
                <div className="flex justify-between items-start gap-4">
                    {stages.map((stage, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center group">
                            <div className={clsx(
                                "w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all group-hover:scale-110",
                                stage.color
                            )}>
                                <stage.icon className="h-6 w-6" />
                            </div>
                            <h4 className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">{stage.label}</h4>
                            <p className="text-2xl font-black text-gray-900 mt-1">{stage.value}</p>

                            {stage.rate !== undefined && (
                                <div className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                    <ArrowDown className="h-3 w-3" />
                                    {stage.rate.toFixed(1)}%
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Progress bar style funnel */}
                <div className="space-y-4">
                    {stages.map((stage, idx) => (
                        <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                                <span>{stage.label}</span>
                                <span>{((stage.value / (data.invites || 1)) * 100).toFixed(0)}% of Total</span>
                            </div>
                            <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                                <div
                                    className={clsx("h-full transition-all duration-1000", stage.color)}
                                    style={{ width: `${(stage.value / (data.invites || 1)) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
