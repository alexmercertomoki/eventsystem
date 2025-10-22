import { z } from 'zod';

// 登录验证
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// 创建活动验证
export const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().max(1000).optional(),
  coverImage: z.string().url('Invalid URL').optional(),
  startTime: z.string().datetime('Invalid datetime format'),
  endTime: z.string().datetime('Invalid datetime format'),
  location: z.string().max(200).optional(),
}).refine(data => new Date(data.endTime) > new Date(data.startTime), {
  message: 'End time must be after start time',
  path: ['endTime'],
});

// 更新活动验证
export const updateEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200).optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens').optional(),
  description: z.string().max(1000).optional(),
  coverImage: z.string().url('Invalid URL').optional(),
  startTime: z.string().datetime('Invalid datetime format').optional(),
  endTime: z.string().datetime('Invalid datetime format').optional(),
  location: z.string().max(200).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED']).optional(),
});

// 内容块验证
export const contentBlockSchema = z.object({
  type: z.enum(['TEXT', 'IMAGE']),
  content: z.object({
    // TEXT 类型
    text: z.string().optional(),
    style: z.object({
      fontSize: z.string().optional(),
      fontWeight: z.string().optional(),
      textAlign: z.string().optional(),
    }).optional(),
    // IMAGE 类型
    url: z.string().url().optional(),
    alt: z.string().optional(),
    caption: z.string().optional(),
  }),
  orderIndex: z.number().int().min(0),
});

// 更新内容块列表验证
export const updateContentBlocksSchema = z.object({
  blocks: z.array(contentBlockSchema),
});
