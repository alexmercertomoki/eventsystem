import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { authService } from '../services/auth.service';
import { prisma } from '../lib/prisma';

/**
 * 认证中间件 - 验证 JWT token
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // 获取 token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // 验证 token
    const decoded = authService.verifyToken(token);

    // 查找管理员
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId },
    });

    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token or account disabled',
      });
    }

    // 将管理员信息附加到请求对象
    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }
};

/**
 * 要求超级管理员权限
 */
export const requireSuperAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.admin?.role !== 'SUPER_ADMIN') {
    return res.status(403).json({
      success: false,
      error: 'Forbidden - Super admin access required',
    });
  }
  next();
};
