import { ILiveLessonsRepository } from '@/application/repositories/live-lessons.repository.interface';
import { LiveLesson } from '@/entities/models/live-lesson';
import { db } from '@/server/db';
import { liveLessons } from '@/server/db/schema';
import { and, asc, eq, gte, inArray, lte } from 'drizzle-orm';
import { LiveLessonMapper } from '../mappers/live-lesson.mapper';

export class LiveLessonsRepository implements ILiveLessonsRepository {
  async getBySchedule(
    startDate: string,
    endDate: string
  ): Promise<LiveLesson[]> {
    const result = await db.query.liveLessons.findMany({
      with: {
        product: true,
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
        product: true,
      },
      orderBy: asc(liveLessons.scheduledAt),
      where: eq(liveLessons.isListed, true),
    });

    return result.map(LiveLessonMapper.toDomain);
  }

  async getByProductId(productIds: string[]): Promise<LiveLesson[]> {
    const result = await db.query.liveLessons.findMany({
      with: {
        product: true,
      },
      orderBy: asc(liveLessons.scheduledAt),
      where: inArray(liveLessons.productId, productIds),
    });

    return result.map(LiveLessonMapper.toDomain);
  }
}
