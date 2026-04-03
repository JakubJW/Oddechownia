import { ILiveLessonsRepository } from '@/application/repositories/live-lessons.repository.interface';
import {
  LiveLesson,
  LiveLessonInsert,
  LiveLessonUpdate,
} from '@/entities/models/live-lesson';
import { db } from '@/server/db';
import { liveLessons, products } from '@/server/db/schema';
import { and, asc, desc, eq, gte, inArray, lt, lte } from 'drizzle-orm';
import { LiveLessonMapper } from '../mappers/live-lesson.mapper';
import { PRODUCT_TYPE } from '@/entities/models/product';
import { createSlug } from '@/lib/utils';

export class LiveLessonsRepository implements ILiveLessonsRepository {
  async create(payload: LiveLessonInsert): Promise<void> {
    await db.transaction(async (tx) => {
      const [product] = await tx
        .insert(products)
        .values({
          name: payload.title,
          description: payload.description,
          slug: createSlug(payload.title),
          imageId: payload.imageId,
          type: PRODUCT_TYPE.LIVE_LESSON,
          subscriberAccess: payload.subscriberAccess,
          price: payload.price,
          priceId: payload.priceId,
          isVisible: true,
        })
        .returning();

      const [lesson] = await tx
        .insert(liveLessons)
        .values({
          title: payload.title,
          description: payload.description,
          duration: payload.duration,
          scheduledAt: payload.scheduledAt,
          productId: product.id,
        })
        .returning();

      return { ...lesson, product };
    });

    // return LiveLessonMapper.toDomain(result);
  }

  async update(lessonId: string, payload: LiveLessonUpdate): Promise<void> {
    await db.transaction(async (tx) => {
      const [lesson] = await tx
        .update(liveLessons)
        .set({
          title: payload.title,
          description: payload.description,
          duration: payload.duration,
          scheduledAt: payload.scheduledAt,
          isListed: payload.isListed,
          meetingLink: payload.meetingLink,
          recordingUrl: payload.recordingUrl,
        })
        .where(eq(liveLessons.id, lessonId))
        .returning();

      const [product] = await tx
        .update(products)
        .set({
          name: payload.title,
          description: payload.description,
          slug: createSlug(payload.title),
          imageId: payload.imageId,
          type: PRODUCT_TYPE.LIVE_LESSON,
          subscriberAccess: payload.subscriberAccess,
          price: payload.price,
          priceId: payload.priceId,
          isVisible: true,
        })
        .where(eq(products.id, lesson.productId!))
        .returning();

      return { ...lesson, product };
    });

    // return LiveLessonMapper.toDomain(result);
  }

  async getBySchedule(
    startDate: string,
    endDate: string
  ): Promise<LiveLesson[]> {
    const result = await db.query.liveLessons.findMany({
      with: {
        product: {
          with: {
            image: true,
          },
        },
      },
      where: and(
        gte(liveLessons.scheduledAt, startDate),
        lte(liveLessons.scheduledAt, endDate)
      ),
    });

    return result.map(LiveLessonMapper.toDomain);
  }

  async getVisibleUpcomingLiveLessons(): Promise<LiveLesson[]> {
    const result = await db.query.liveLessons.findMany({
      with: {
        product: {
          with: {
            image: true,
          },
        },
      },
      orderBy: desc(liveLessons.scheduledAt),
      where: eq(liveLessons.isListed, true),
    });

    return result.map(LiveLessonMapper.toDomain);
  }

  async getAll(cursor: string | null): Promise<LiveLesson[]> {
    const cursorCondition = cursor
      ? lt(liveLessons.scheduledAt, cursor)
      : undefined;

    const result = await db.query.liveLessons.findMany({
      with: {
        product: {
          with: {
            purchases: true,
            image: true,
          },
        },
      },
      orderBy: desc(liveLessons.scheduledAt),
      where: cursorCondition,
      limit: 8,
    });

    return result.map(LiveLessonMapper.toDomain);
  }

  async getById(id: string): Promise<LiveLesson> {
    const result = await db.query.liveLessons.findFirst({
      where: eq(liveLessons.id, id),
      with: {
        product: {
          with: {
            image: true,
          },
        },
      },
    });

    if (!result) {
      throw new Error('Not found');
    }

    return LiveLessonMapper.toDomain(result);
  }

  async getByProductId(productIds: string[]): Promise<LiveLesson[]> {
    const result = await db.query.liveLessons.findMany({
      with: {
        product: {
          with: { image: true },
        },
      },
      orderBy: asc(liveLessons.scheduledAt),
      where: inArray(liveLessons.productId, productIds),
    });

    return result.map(LiveLessonMapper.toDomain);
  }
}
