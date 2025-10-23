'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authApi } from '@/lib/api-client';
import { auth } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e?: React.MouseEvent | React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation(); // 阻止事件冒泡
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await authApi.login(email, password);

      if (response.success) {
        // 保存登录信息
        auth.setAuth(response.data.token, response.data.admin);

        // 跳转到活动列表页
        router.push('/admin/events');
      } else {
        // 后端返回的错误
        setError(response.error || '登录失败');
      }
    } catch (err: any) {
      // 网络错误或其他异常
      console.error('Login error:', err);

      if (err.response?.data?.error) {
        // 后端返回的错误信息
        setError(err.response.data.error);
      } else if (err.response?.status === 401) {
        setError('邮箱或密码错误，请重试');
      } else if (err.message) {
        setError('网络错误: ' + err.message);
      } else {
        setError('登录失败，请检查邮箱和密码');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            活动平台管理系统
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            管理员登录
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <Input
              label="邮箱地址"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(''); // 清除错误
              }}
              required
              placeholder="admin@eventsystem.com"
              autoComplete="email"
              error={error ? ' ' : ''} // 有错误时高亮
            />

            <Input
              label="密码"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(''); // 清除错误
              }}
              required
              placeholder="请输入密码"
              autoComplete="current-password"
              error={error ? ' ' : ''} // 有错误时高亮
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    登录失败
                  </h3>
                  <div className="mt-1 text-sm text-red-700">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <Button
              type="button"
              onClick={handleSubmit}
              className="w-full"
              size="lg"
              isLoading={isLoading}
              disabled={isLoading}
            >
              登录
            </Button>
          </div>

          <div className="text-sm text-center text-gray-600">
            <p>测试账号：admin@eventsystem.com</p>
            <p>密码：admin123</p>
          </div>
        </form>
      </div>
    </div>
  );
}
