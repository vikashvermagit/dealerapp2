import React from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';

interface KPICardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    trend?: {
        value: number; // percentage
        direction: 'up' | 'down';
    };
    to?: string;
    color?: 'blue' | 'green' | 'red' | 'orange' | 'purple';
    loading?: boolean;
}

const colorMap = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
};

const iconColorMap = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    orange: 'text-orange-600',
    purple: 'text-purple-600',
};

export const KPICard: React.FC<KPICardProps> = ({
    title,
    value,
    icon: Icon,
    trend,
    to,
    color = 'blue',
    loading = false
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (to && !loading) {
            navigate(to);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={clsx(
                "relative overflow-hidden rounded-xl border p-6 bg-white shadow-sm transition-all duration-200",
                to && !loading ? "cursor-pointer hover:shadow-md hover:border-blue-300" : "",
                loading && "animate-pulse"
            )}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <div className="mt-2 flex items-baseline">
                        {loading ? (
                            <div className="h-8 w-24 bg-gray-200 rounded"></div>
                        ) : (
                            <span className="text-3xl font-bold text-gray-900">{value}</span>
                        )}
                    </div>
                </div>
                <div className={clsx("p-3 rounded-lg", colorMap[color])}>
                    <Icon className={clsx("h-6 w-6", iconColorMap[color])} />
                </div>
            </div>

            {trend && !loading && (
                <div className="mt-4 flex items-center text-sm">
                    <span className={clsx(
                        "font-medium",
                        trend.direction === 'up' ? "text-green-600" : "text-red-600"
                    )}>
                        {trend.direction === 'up' ? '+' : '-'}{trend.value}%
                    </span>
                    <span className="ml-2 text-gray-400">from last month</span>
                </div>
            )}
        </div>
    );
};
