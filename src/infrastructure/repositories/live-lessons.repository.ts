import { ILiveLessonsRepository } from '@/application/repositories/live-lessons.repository.interface';
import { LiveLessonInsert, LiveLesson } from '@/entities/models/live-lesson';
import { db } from '@/server/db';
import { liveLessons } from '@/server/db/schema';
import { supabaseService } from '@/server/services/supabase.service';
import { lte, gte, and } from 'drizzle-orm';

export class LiveLessonsRepository implements ILiveLessonsRepository {
  // async create(payload: LiveLessonInsert): Promise<LiveLesson> {}

  // async update(payload: Partial<LiveLessonInsert>): Promise<LiveLesson> {}

  // async delete(lessonId: string): Promise<void> {}

  // async getAll(): Promise<LiveLesson[]> {}

  async getBySchedule(
    startDate: string,
    endDate: string
  ): Promise<LiveLesson[]> {
    const result = await db.query.liveLessons.findMany({
      with: {
        thumbnail: true,
      },
      where: and(
        gte(liveLessons.scheduledAt, startDate),
        lte(liveLessons.scheduledAt, endDate)
      ),
    });

    return result.map((item) => ({
      title: item.title,
      description: item.description!,
      scheduledAt: item.scheduledAt,
      duration: item.duration,
      isListed: item.isListed,
      isPublished: item.isPublished,
      isCompleted: item.isCompleted,
      meetingLink: item.meetingLink ?? undefined,
      recordingUrl: item.recordingUrl ?? undefined,
      thumbnailUrl: supabaseService.getThumbnailUrl(
        item.thumbnail!.bucket,
        item.thumbnail!.path
      ).data,
    }));
  }

  // async getVisibleUpcomingLiveLessons(): Promise<LiveLesson[]> {}
}
