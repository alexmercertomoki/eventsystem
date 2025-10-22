import { Request } from 'express';
import { Admin } from '@prisma/client';

// 扩展 Express Request 类型
export interface AuthRequest extends Request {
  admin?: Admin;
}

// JWT Payload
export interface JWTPayload {
  adminId: string;
  email: string;
  role: string;
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
