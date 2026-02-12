import apiClient from '../../../core/api/client';
import type { DashboardData } from '../types';

export const getDashboardData = async (): Promise<DashboardData> => {
    const response = await apiClient.get<DashboardData>('/dashboard/overview');
    return response.data;
};
