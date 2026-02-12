import { useAdminStore } from '../store';
import {
    ShieldCheck,
    Search,
    Terminal,
    User,
    Globe,
    Database,
    ExternalLink
} from 'lucide-react';
import clsx from 'clsx';

export const AuditLogsPage = () => {
    const { auditLogs } = useAdminStore();

    const getActionColor = (action: string) => {
        switch (action) {
            case 'security_alert': return 'text-red-600 bg-red-50';
            case 'login': return 'text-blue-600 bg-blue-50';
            case 'settings_changed': return 'text-orange-600 bg-orange-50';
            default: return 'text-emerald-600 bg-emerald-50';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                    <Terminal className="h-8 w-8 text-brand-500" />
                    System Audit Logs
                </h1>
                <p className="text-gray-500 mt-1 uppercase text-[10px] font-black tracking-[0.2em]">Read-Only Regulatory Trail</p>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 bg-gray-50/50 border-b flex flex-col md:flex-row justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search actions, users or IPs..."
                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all font-medium"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50">Filter Results</button>
                        <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50">Export CSV</button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b">
                            <tr>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Event</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actor</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Source IP</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Timestamp</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {auditLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className={clsx("p-2 rounded-lg", getActionColor(log.action))}>
                                                <Database className="h-3.5 w-3.5" />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 capitalize leading-none">
                                                {log.action.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-brand-50 flex items-center justify-center">
                                                <User className="h-3 w-3 text-brand-600" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-600">{log.performedBy}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <Globe className="h-3.5 w-3.5 text-gray-400" />
                                            <span className="text-xs font-mono text-gray-500">{log.ipAddress}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-gray-500 font-medium">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 rounded-lg transition-all text-gray-400">
                                            <ExternalLink className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 bg-gray-50/50 border-t flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-3 w-3 text-emerald-500" />
                        Tamper-Proof Ledger Active
                    </div>
                    <div>Page 1 of 12</div>
                </div>
            </div>
        </div>
    );
};
