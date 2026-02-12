import { Calendar, MapPin, Tag, Filter } from 'lucide-react';
import { useAnalyticsStore } from '../store';

export const AnalyticsFilters = () => {
    const { filters, setFilters } = useAnalyticsStore();

    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-wrap gap-6 items-end">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    Date Range
                </label>
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        value={filters.dateRange.start}
                        onChange={(e) => setFilters({ dateRange: { ...filters.dateRange, start: e.target.value } })}
                        className="p-3 bg-gray-50 border-none rounded-xl outline-none text-xs font-bold text-gray-700"
                    />
                    <span className="text-gray-300">to</span>
                    <input
                        type="date"
                        value={filters.dateRange.end}
                        onChange={(e) => setFilters({ dateRange: { ...filters.dateRange, end: e.target.value } })}
                        className="p-3 bg-gray-50 border-none rounded-xl outline-none text-xs font-bold text-gray-700"
                    />
                </div>
            </div>

            <div className="space-y-2 flex-1 min-w-[150px]">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                    <Tag className="h-3 w-3" />
                    Brand
                </label>
                <select
                    value={filters.brand || ''}
                    onChange={(e) => setFilters({ brand: e.target.value || undefined })}
                    className="w-full p-3 bg-gray-50 border-none rounded-xl outline-none text-xs font-bold text-gray-700 appearance-none"
                >
                    <option value="">All Brands</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Tesla">Tesla</option>
                    <option value="Ford">Ford</option>
                </select>
            </div>

            <div className="space-y-2 flex-1 min-w-[150px]">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    City
                </label>
                <select
                    value={filters.city || ''}
                    onChange={(e) => setFilters({ city: e.target.value || undefined })}
                    className="w-full p-3 bg-gray-50 border-none rounded-xl outline-none text-xs font-bold text-gray-700 appearance-none"
                >
                    <option value="">All Cities</option>
                    <option value="London">London</option>
                    <option value="Manchester">Manchester</option>
                </select>
            </div>

            <button className="p-3 bg-gray-900 text-white rounded-xl hover:bg-brand-600 transition-all flex items-center gap-2 shadow-lg active:scale-95">
                <Filter className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Apply</span>
            </button>
        </div>
    );
};
