export interface DashboardStats {
    activeRooms: number;
    pendingInvitations: number;
    openQuotes: number;
    processingOrders: number;
    lowStockCount: number;
}

export interface DashboardAlert {
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    actionUrl?: string;
    actionLabel?: string;
    dismissible?: boolean;
}

export interface DashboardData {
    stats: DashboardStats;
    alerts: DashboardAlert[];
}
