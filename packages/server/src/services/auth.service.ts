import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { JWTPayload } from '../types';

export class AuthService {
  /**
   * 管理员登录
   */
  async login(email: string, password: string) {
    // 查找管理员
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      throw new Error('Invalid credentials');
    }

    if (!admin.isActive) {
      throw new Error('Account is disabled');
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // 生成 JWT token
    const token = this.generateToken({
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
    });

    // 返回 token 和管理员信息（不包含密码）
    return {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  }

  /**
   * 验证 JWT token
   */
  verifyToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key'
      ) as JWTPayload;
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * 生成 JWT token
   */
  private generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '7d', // 7天过期
    });
  }

  /**
   * 通过 ID 获取管理员信息
   */
  async getAdminById(id: string) {
    const admin = await prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!admin) {
      throw new Error('Admin not found');
    }

    return admin;
  }
}

export const authService = new AuthService();
