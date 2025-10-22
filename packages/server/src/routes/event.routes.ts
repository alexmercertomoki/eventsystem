import { Router, Response } from 'express';
import { eventService } from '../services/event.service';
import {
  createEventSchema,
  updateEventSchema,
  updateContentBlocksSchema,
} from '../utils/validation';
import { authenticate } from '../middleware/auth.middleware';
import { AuthRequest } from '../types';

const router = Router();

/**
 * POST /api/admin/events
 * 创建活动（需要认证）
 */
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    // 验证输入
    const validatedData = createEventSchema.parse(req.body);

    // 创建活动
    const event = await eventService.createEvent({
      ...validatedData,
      startTime: new Date(validatedData.startTime),
      endTime: new Date(validatedData.endTime),
      createdBy: req.admin.id,
    });

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/admin/events
 * 获取活动列表（需要认证）
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { status, page, limit } = req.query;

    const result = await eventService.getEvents({
      status: status as any,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/admin/events/:id
 * 获取单个活动（需要认证）
 */
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const event = await eventService.getEventById(req.params.id);

    res.json({
      success: true,
      data: event,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * PUT /api/admin/events/:id
 * 更新活动（需要认证）
 */
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // 验证输入
    const validatedData = updateEventSchema.parse(req.body);

    // 转换日期
    const updateData: any = { ...validatedData };
    if (validatedData.startTime) {
      updateData.startTime = new Date(validatedData.startTime);
    }
    if (validatedData.endTime) {
      updateData.endTime = new Date(validatedData.endTime);
    }

    const event = await eventService.updateEvent(req.params.id, updateData);

    res.json({
      success: true,
      data: event,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * DELETE /api/admin/events/:id
 * 删除活动（需要认证）
 */
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const result = await eventService.deleteEvent(req.params.id);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * PUT /api/admin/events/:id/content-blocks
 * 更新活动的内容块（需要认证）
 */
router.put(
  '/:id/content-blocks',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.admin) {
        return res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
      }

      // 验证输入
      const validatedData = updateContentBlocksSchema.parse(req.body);

      const blocks = await eventService.updateContentBlocks(
        req.params.id,
        validatedData.blocks,
        req.admin.id
      );

      res.json({
        success: true,
        data: { blocks },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

export default router;
