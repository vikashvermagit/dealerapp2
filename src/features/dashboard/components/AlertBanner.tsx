import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import clsx from 'clsx';
import type { DashboardAlert } from '../types';

const styles = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    success: 'bg-green-50 text-green-800 border-green-200',
};

const icons = {
    info: Info,
    warning: AlertTriangle,
    error: AlertCircle,
    success: CheckCircle,
};

interface AlertBannerProps {
    alert: DashboardAlert;
    onDismiss?: (id: string) => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ alert, onDismiss }) => {
    const Icon = icons[alert.type];

    return (
        <div className={clsx("flex items-start p-4 mb-4 border rounded-md", styles[alert.type])}>
            <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium">{alert.title}</h3>
                <div className="mt-1 text-sm opacity-90">{alert.message}</div>
                {alert.actionUrl && (
                    <div className="mt-2">
                        <a href={alert.actionUrl} className="text-sm font-bold underline hover:opacity-80">
                            {alert.actionLabel || 'View Details'}
                        </a>
                    </div>
                )}
            </div>
            {alert.dismissible && onDismiss && (
                <button
                    onClick={() => onDismiss(alert.id)}
                    className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-md hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-50 focus:ring-blue-600"
                >
                    <span className="sr-only">Dismiss</span>
                    <X className="h-5 w-5" />
                </button>
            )}
        </div>
    );
};
