import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (phone: string, mpin: string) => {
        const response = await api.post('/admin/login', { phone, mpin });
        if (response.data.success) {
            localStorage.setItem('admin_token', response.data.token);
            localStorage.setItem('admin_user', JSON.stringify(response.data.admin));
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
    },
    isAuthenticated: () => {
        return !!localStorage.getItem('admin_token');
    }
};

export const dashboardService = {
    getStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data.data;
    }
};

export const userService = {
    getUsers: async (page = 1, limit = 10, search = '') => {
        const response = await api.get('/admin/users', { params: { page, limit, search } });
        return response.data.data;
    },
    updateStatus: async (id: string, status: string) => {
        const response = await api.put(`/admin/users/${id}/status`, { status });
        return response.data.data;
    }
};

export const marketService = {
    getMarkets: async () => {
        const response = await api.get('/markets');
        return response.data.data;
    },
    createMarket: async (data: any) => {
        const response = await api.post('/markets', data);
        return response.data.data;
    }
};

export const resultService = {
    declareResult: async (data: any) => {
        const response = await api.post('/markets/result', data);
        return response.data.data;
    }
}

export default api;
