import { db } from '@/server/db';
import { userLessonProgress } from '@/server/db/schema';
import { getUser } from '../actions/user';
import { revalidatePath } from 'next/cache';
import { sql } from 'drizzle-orm';

export const saveProgress = async (
  lessonId: number,
  seconds: number,
  totalDuration: number,
  playlistId?: number
) => {
  const user = await getUser();
  if (!user) return { error: 'Unauthorized' };

  // Logic: Mark as complete if watched > 90%
  const progressRatio = totalDuration > 0 ? seconds / totalDuration : 0;
  const isCompletedNow = progressRatio >= 0.9;

  try {
    await db
      .insert(userLessonProgress)
      .values({
        userId: user.id,
        lessonId,
        playlistId,
        lastPositionSeconds: Math.floor(seconds),
        isCompleted: isCompletedNow,
        updatedAt: new Date().toISOString(),
      })
      .onConflictDoUpdate({
        target: [userLessonProgress.userId, userLessonProgress.lessonId],
        set: {
          lastPositionSeconds: Math.floor(seconds),
          updatedAt: new Date().toISOString(),
          // Smart Logic: If it was ALREADY true, keep it true. Otherwise use new status.
          isCompleted: sql`CASE WHEN user_lesson_progress.is_completed = true THEN true ELSE ${isCompletedNow} END`,
          // Update playlist context if provided
          playlistId: playlistId || sql`user_lesson_progress.playlist_id`,
        },
      });

    revalidatePath('/dashboard');
    return { success: true, isCompleted: isCompletedNow };
  } catch (error) {
    console.error('Save Progress Error', error);
    return { error: 'Failed' };
  }
};

export const ProgressService = {
  saveProgress,
};
