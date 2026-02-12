import {
    BarChart3,
    TrendingUp,
    Users,
    Target,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    ChevronRight
} from 'lucide-react';
import clsx from 'clsx';

export const ReportsPage = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Performance Reports</h1>
                    <p className="text-gray-500 mt-1">Deep insights into your deal conversion and volume.</p>
                </div>
                <div className="flex bg-white border border-gray-100 p-1.5 rounded-2xl shadow-sm">
                    {['24H', '7D', '30D', '1Y'].map(range => (
                        <button key={range} className={clsx(
                            "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                            range === '7D' ? "bg-gray-900 text-white shadow-lg" : "text-gray-500 hover:text-gray-900"
                        )}>
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Volume', value: '$2.4M', trend: '+12%', up: true, icon: TrendingUp },
                    { label: 'Active Deals', value: '48', trend: '+4', up: true, icon: BarChart3 },
                    { label: 'Conversion Rate', value: '18.4%', trend: '-2%', up: false, icon: Target },
                    { label: 'New Customers', value: '124', trend: '+18%', up: true, icon: Users },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-brand-300 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-gray-50 rounded-2xl text-gray-400 group-hover:text-brand-500 transition-colors">
                                <stat.icon className="h-5 w-5" />
                            </div>
                            <div className={clsx(
                                "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase",
                                stat.up ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                            )}>
                                {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                {stat.trend}
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-2xl font-black text-gray-900 mt-1">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 h-96 flex flex-col">
                    <div className="flex justify-between items-center mb-12">
                        <h3 className="font-black text-gray-900 uppercase tracking-tight text-lg">Inventory Turnover Rate</h3>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                <span className="w-3 h-3 rounded-full bg-brand-500" />
                                SEDAN
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 ml-4">
                                <span className="w-3 h-3 rounded-full bg-gray-200" />
                                SUV
                            </div>
                        </div>
                    </div>
                    {/* Visual Placeholder for a Chart */}
                    <div className="flex-1 flex items-end gap-1.5 px-4 mb-2">
                        {[40, 70, 45, 90, 65, 80, 55, 100, 75, 40, 85, 60].map((h, i) => (
                            <div key={i} className="flex-1 space-y-1 group">
                                <div className="flex flex-col-reverse h-full bg-gray-50 rounded-full overflow-hidden">
                                    <div
                                        style={{ height: `${h}%` }}
                                        className="bg-brand-500 rounded-full group-hover:bg-brand-400 transition-all cursor-pointer relative"
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {h}%
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[8px] font-black text-gray-300 text-center">M{i + 1}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 bg-gray-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl flex flex-col">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/20 blur-[80px] rounded-full -mr-20 -mt-20" />
                    <h3 className="font-black uppercase tracking-tight text-lg relative z-10">AI Predictive Model</h3>
                    <p className="text-gray-400 text-sm mt-2 relative z-10 leading-relaxed">Based on your last 30 days, we predict a **24% increase** in deal flow for SUVs next month.</p>

                    <div className="mt-auto relative z-10 pt-12">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <p className="text-[10px] font-black text-brand-400 uppercase tracking-widest mb-1">Success Projection</p>
                                <p className="text-4xl font-black">94.2<span className="text-brand-400">%</span></p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Reliability Index</p>
                                <p className="text-sm font-bold">High (0.89)</p>
                            </div>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-500 w-[94%]" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-brand-50 p-6 rounded-3xl border border-brand-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-white p-3 rounded-2xl text-brand-600 shadow-sm">
                        <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-brand-900 font-mono">Quarterly Performance Review</h4>
                        <p className="text-xs text-brand-700 opacity-80">Your Q1 2024 report is ready for detailed analysis.</p>
                    </div>
                </div>
                <button className="bg-brand-600 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-700 transition-all flex items-center gap-2">
                    Open Report
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};
