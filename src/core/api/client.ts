import axios from 'axios';
import { CONFIG } from '../config';

const apiClient = axios.create({
    baseURL: CONFIG.API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request Interceptor: Attach Token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Global Error Handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status } = error.response;
            if (status === 401) {
                localStorage.removeItem('auth_token');
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            } else if (status === 403) {
                console.error('Access Forbidden');
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
