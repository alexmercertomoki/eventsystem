import { Router, Request, Response } from 'express';
import { eventService } from '../services/event.service';

const router = Router();

/**
 * GET /api/events
 * 获取已发布的活动列表（公开接口）
 */
router.get('/events', async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;

    const result = await eventService.getEvents({
      status: 'PUBLISHED', // 只返回已发布的活动
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
 * GET /api/events/:slug
 * 获取单个已发布活动详情（公开接口）
 */
router.get('/events/:slug', async (req: Request, res: Response) => {
  try {
    const event = await eventService.getEventBySlug(req.params.slug);

    // 只允许访问已发布的活动
    if (event.status !== 'PUBLISHED') {
      return res.status(404).json({
        success: false,
        error: 'Event not found',
      });
    }

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

export default router;
