import { prisma } from '../lib/prisma';
import { EventStatus } from '@prisma/client';

export class EventService {
  /**
   * 创建活动
   */
  async createEvent(data: {
    title: string;
    slug: string;
    description?: string;
    coverImage?: string;
    startTime: Date;
    endTime: Date;
    location?: string;
    createdBy: string;
  }) {
    // 检查 slug 是否已存在
    const existingEvent = await prisma.event.findUnique({
      where: { slug: data.slug },
    });

    if (existingEvent) {
      throw new Error('Event with this slug already exists');
    }

    // 创建活动
    const event = await prisma.event.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        coverImage: data.coverImage,
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location,
        createdBy: data.createdBy,
        status: 'DRAFT',
      },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return event;
  }

  /**
   * 获取活动列表
   */
  async getEvents(filters?: {
    status?: EventStatus;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters?.status) {
      where.status = filters.status;
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          startTime: 'desc',
        },
        include: {
          admin: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.event.count({ where }),
    ]);

    return {
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 通过 ID 获取活动
   */
  async getEventById(id: string) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        contentBlocks: {
          orderBy: {
            orderIndex: 'asc',
          },
        },
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    return event;
  }

  /**
   * 通过 slug 获取活动
   */
  async getEventBySlug(slug: string) {
    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        contentBlocks: {
          orderBy: {
            orderIndex: 'asc',
          },
        },
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    return event;
  }

  /**
   * 更新活动
   */
  async updateEvent(
    id: string,
    data: {
      title?: string;
      slug?: string;
      description?: string;
      coverImage?: string;
      startTime?: Date;
      endTime?: Date;
      location?: string;
      status?: EventStatus;
    }
  ) {
    // 检查活动是否存在
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      throw new Error('Event not found');
    }

    // 如果更新 slug，检查是否冲突
    if (data.slug && data.slug !== existingEvent.slug) {
      const slugExists = await prisma.event.findUnique({
        where: { slug: data.slug },
      });

      if (slugExists) {
        throw new Error('Event with this slug already exists');
      }
    }

    // 更新活动
    const event = await prisma.event.update({
      where: { id },
      data: {
        ...data,
        publishedAt: data.status === 'PUBLISHED' ? new Date() : existingEvent.publishedAt,
      },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return event;
  }

  /**
   * 删除活动
   */
  async deleteEvent(id: string) {
    // 检查活动是否存在
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    // 删除活动（会级联删除关联的 contentBlocks）
    await prisma.event.delete({
      where: { id },
    });

    return { message: 'Event deleted successfully' };
  }

  /**
   * 更新活动的内容块
   */
  async updateContentBlocks(
    eventId: string,
    blocks: Array<{
      type: 'TEXT' | 'IMAGE';
      content: any;
      orderIndex: number;
    }>,
    adminId: string
  ) {
    // 检查活动是否存在
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    // 使用事务删除旧的内容块并创建新的
    const result = await prisma.$transaction(async (tx) => {
      // 删除现有的内容块
      await tx.contentBlock.deleteMany({
        where: { eventId },
      });

      // 创建新的内容块
      const createdBlocks = await Promise.all(
        blocks.map((block) =>
          tx.contentBlock.create({
            data: {
              eventId,
              type: block.type,
              content: block.content,
              orderIndex: block.orderIndex,
              createdBy: adminId,
            },
          })
        )
      );

      return createdBlocks;
    });

    return result;
  }
}

export const eventService = new EventService();
