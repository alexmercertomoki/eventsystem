import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// 创建 axios 实例
export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 自动添加 token
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 响应拦截器 - 处理错误
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token 过期或无效，清除并跳转登录
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;

        // 只有不在登录页面时才跳转
        // 如果已经在登录页面，让页面自己处理错误
        if (currentPath !== '/login') {
          localStorage.removeItem('token');
          localStorage.removeItem('admin');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// API 方法
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

export const eventApi = {
  list: async (params?: { status?: string; page?: number; limit?: number }) => {
    const response = await apiClient.get('/admin/events', { params });
    return response.data;
  },
  get: async (id: string) => {
    const response = await apiClient.get(`/admin/events/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await apiClient.post('/admin/events', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/admin/events/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/admin/events/${id}`);
    return response.data;
  },
  updateContentBlocks: async (id: string, blocks: any[]) => {
    const response = await apiClient.put(`/admin/events/${id}/content-blocks`, {
      blocks,
    });
    return response.data;
  },
};
