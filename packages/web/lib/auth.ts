export interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
}

export const auth = {
  // 保存登录信息
  setAuth: (token: string, admin: Admin) => {
    localStorage.setItem('token', token);
    localStorage.setItem('admin', JSON.stringify(admin));
  },

  // 获取 token
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // 获取当前管理员信息
  getAdmin: (): Admin | null => {
    const adminStr = localStorage.getItem('admin');
    if (!adminStr) return null;
    try {
      return JSON.parse(adminStr);
    } catch {
      return null;
    }
  },

  // 清除登录信息
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
  },

  // 检查是否已登录
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // 检查是否是超级管理员
  isSuperAdmin: (): boolean => {
    const admin = auth.getAdmin();
    return admin?.role === 'SUPER_ADMIN';
  },
};
