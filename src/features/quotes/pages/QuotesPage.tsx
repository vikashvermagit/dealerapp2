import { useState } from 'react';
import { useQuoteStore } from '../store';
import { QuoteBuilder } from '../components/QuoteBuilder';
import { FileText, Search, Filter, ExternalLink, Lock, Clock } from 'lucide-react';
import clsx from 'clsx';
import { RequirePermission } from '../../users/components/RequirePermission';

export const QuotesPage = () => {
    const { quotes } = useQuoteStore();
    const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredQuotes = quotes.filter(q =>
        q.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedQuote = quotes.find(q => q.id === selectedQuoteId);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Quotations Management</h1>
                    <p className="text-gray-500 mt-1">Manage draft and submitted quotes.</p>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by customer or vehicle..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">
                    <Filter className="h-4 w-4" />
                    Filters
                </button>
            </div>

            {/* Quotes Grid/List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredQuotes.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No quotes found.</p>
                    </div>
                ) : (
                    filteredQuotes.map((quote) => (
                        <div key={quote.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all group flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-gray-900 leading-tight group-hover:text-brand-600 transition-colors">
                                        {quote.customerName}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">{quote.vehicleModel}</p>
                                </div>
                                <span className={clsx(
                                    "px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest",
                                    quote.status === 'locked' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                )}>
                                    {quote.status}
                                </span>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6 flex-1">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                        <Lock className="h-3 w-3" />
                                        Current Revision
                                    </div>
                                    <span className="text-sm font-black text-gray-900">v{quote.versions[quote.currentVersionIndex].versionNumber}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                        <Clock className="h-3 w-3" />
                                        Revisions Left
                                    </div>
                                    <span className="text-sm font-black text-gray-900">{quote.maxEdits - quote.editCount}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedQuoteId(quote.id)}
                                className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-brand-600 transition-all flex items-center justify-center gap-2"
                            >
                                <RequirePermission
                                    permission="quotes_manage"
                                    fallback={<span>View Quote</span>}
                                >
                                    {quote.status === 'locked' ? 'View Quote' : 'Edit Draft'}
                                </RequirePermission>
                                <ExternalLink className="h-4 w-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Modal for Quote Builder */}
            {selectedQuote && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <QuoteBuilder
                        quote={selectedQuote}
                        onClose={() => setSelectedQuoteId(null)}
                    />
                </div>
            )}
        </div>
    );
};
