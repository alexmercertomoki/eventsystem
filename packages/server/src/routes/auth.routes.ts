import { Router, Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { loginSchema } from '../utils/validation';
import { authenticate } from '../middleware/auth.middleware';
import { AuthRequest } from '../types';

const router = Router();

/**
 * POST /api/auth/login
 * 管理员登录
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    // 验证输入
    const validatedData = loginSchema.parse(req.body);

    // 执行登录
    const result = await authService.login(
      validatedData.email,
      validatedData.password
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: error.message || 'Login failed',
    });
  }
});

/**
 * GET /api/auth/me
 * 获取当前登录管理员信息
 */
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    const admin = await authService.getAdminById(req.admin.id);

    res.json({
      success: true,
      data: admin,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
