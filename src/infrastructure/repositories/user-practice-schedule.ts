import { IUserPracticeScheduleRepository } from '@/application/repositories/user-practice-schedule.repository.interface';
import {
  UserPracticeScheduleInsert,
  UserPracticeSchedule,
  UserPracticeScheduleEvent,
} from '@/entities/models/user-practice-schedule';
import { env } from '@/env';
import { db } from '@/server/db';
import { userPracticeSchedules } from '@/server/db/schema';
import { supabaseService } from '@/server/services/supabase.service';
import { and, eq, gte, isNull, lte } from 'drizzle-orm';

export class UserPracticeScheduleRepository implements IUserPracticeScheduleRepository {
  async create(
    payload: UserPracticeScheduleInsert
  ): Promise<UserPracticeSchedule> {
    const [result] = await db
      .insert(userPracticeSchedules)
      .values(payload)
      .returning();

    return {
      id: result.id,
      lessonId: result.lessonId,
      playlistId: result.playlistId,
      userId: result.userId ?? undefined,
      scheduledAt: result.scheduledAt,
    };
  }

  async update(
    scheduleId: string,
    payload: Partial<UserPracticeScheduleInsert>
  ): Promise<UserPracticeSchedule> {
    const [result] = await db
      .update(userPracticeSchedules)
      .set(payload)
      .where(eq(userPracticeSchedules.id, scheduleId))
      .returning();

    return {
      id: result.id,
      lessonId: result.lessonId,
      playlistId: result.playlistId,
      userId: result.userId ?? undefined,
      scheduledAt: result.scheduledAt,
    };
  }

  async delete(scheduleId: string): Promise<void> {
    await db
      .delete(userPracticeSchedules)
      .where(eq(userPracticeSchedules.id, scheduleId));
  }

  async getSchedule(
    startDate?: string,
    endDate?: string
  ): Promise<UserPracticeScheduleEvent[]> {
    const dateRangeConditions = [
      startDate ? gte(userPracticeSchedules.scheduledAt, startDate) : undefined,
      endDate ? lte(userPracticeSchedules.scheduledAt, endDate) : undefined,
    ];

    const result = await db.query.userPracticeSchedules.findMany({
      where: and(isNull(userPracticeSchedules.userId), ...dateRangeConditions),
      with: {
        lesson: {
          with: {
            thumbnail: true,
            video: true,
          },
        },
        playlist: true,
      },
    });

    return result.map((schedule) => ({
      id: schedule.id,
      lesson: {
        id: schedule.lesson.id,
        title: schedule.lesson.name,
        url: `${env.NEXT_PUBLIC_APP_URL}/studio-jogi-online/${schedule.playlist?.slug}/${schedule.lesson.slug}`,
        thumbnailUrl: supabaseService.getThumbnailUrl(
          schedule.lesson.thumbnail.bucket,
          schedule.lesson.thumbnail.path
        ).data,
        duration: schedule.lesson.video!.duration!,
      },
      scheduledAt: schedule.scheduledAt,
    }));
  }

  // async getByUserId(
  //   userId: string,
  //   startDate?: string,
  //   endDate?: string
  // ): Promise<UserPracticeScheduleEvent[]> {
  //   const dateRangeConditions = [
  //     startDate ? gte(userPracticeSchedules.scheduledAt, startDate) : undefined,
  //     endDate ? lte(userPracticeSchedules.scheduledAt, endDate) : undefined,
  //   ];

  //   const result = await db.query.userPracticeSchedules.findMany({
  //     where: and(
  //       eq(userPracticeSchedules.userId, userId),
  //       ...dateRangeConditions
  //     ),
  //     with: {
  //       lesson: {
  //         with: {
  //           thumbnail: true,
  //           video: true,
  //         },
  //       },
  //     },
  //   });

  //   return result.map((schedule) => ({
  //     id: schedule.id,
  //     lesson: {
  //       id: schedule.lesson.id,
  //       title: schedule.lesson.name,
  //       slug: schedule.lesson.slug,
  //       thumbnailUrl: schedule.lesson.thumbnail.path,
  //       duration: schedule.lesson.video!.duration!,
  //     },
  //     scheduledAt: schedule.scheduledAt,
  //   }));
  // }
}
