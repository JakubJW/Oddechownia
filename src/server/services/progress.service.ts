import { db } from '@/server/db';
import { userLessonProgress } from '@/server/db/schema';
import { InferSelectModel, sql } from 'drizzle-orm';
import { LessonDetailDTO } from '../models/lesson.models';

const saveProgress = async (
  lessonId: number,
  seconds: number,
  totalDuration: number,
  userId: string,
  playlistId?: number
) => {
  const progressRatio = totalDuration > 0 ? seconds / totalDuration : 0;
  const isCompletedNow = progressRatio >= 0.9;

  try {
    await db
      .insert(userLessonProgress)
      .values({
        userId,
        lessonId,
        playlistId,
        lastPositionSeconds: Math.floor(seconds),
        isCompleted: isCompletedNow,
      })
      .onConflictDoUpdate({
        target: [
          userLessonProgress.userId,
          userLessonProgress.lessonId,
          userLessonProgress.playlistId,
        ],
        set: {
          lastPositionSeconds: Math.floor(seconds),
          isCompleted: sql`CASE WHEN user_lesson_progress.is_completed = true THEN true ELSE ${isCompletedNow} END`,
        },
      });

    return { success: true, isCompleted: isCompletedNow };
  } catch (error) {
    console.error('Save Progress Error', error);
    return { error: 'Failed' };
  }
};

const prepareProgress = (
  progressMap: Map<number, InferSelectModel<typeof userLessonProgress>>,
  lesson: LessonDetailDTO
) => {
  const progress = progressMap.get(lesson.id);
  const duration = lesson.video?.duration || 0;
  const lastPositionSeconds = progress?.lastPositionSeconds || 0;

  let percent = 0;
  if (progress?.isCompleted) {
    percent = 100;
  } else if (duration > 0) {
    percent = (lastPositionSeconds / duration) * 100;
  }

  return {
    isCompleted: progress?.isCompleted,
    lastPositionSeconds,
    percent: Math.min(percent, 100),
  };
};

export const ProgressService = {
  saveProgress,
  prepareProgress,
};
