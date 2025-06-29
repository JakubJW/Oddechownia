'use server';

import { createSlug } from '@/lib/utils';
import { db } from '@/db';
import { eq, desc } from 'drizzle-orm';
import { courses, lessons, videos } from '@/db/schema';
import { ActionResult } from './types';
import { Lesson } from '@/db/types';

interface CreateLesson {
  name: string;
  description: string;
  courseSlug: string;
  video: {
    uploadId: string;
  };
}

export const createLesson = async ({
  name,
  description,
  courseSlug,
  video,
}: CreateLesson): Promise<ActionResult<Lesson>> => {
  try {
    const course = await db.query.courses.findFirst({
      where: eq(courses.slug, courseSlug),
    });

    if (!course)
      return { data: null, success: false, error: 'Course not found' };

    const lessonVideo = await db.query.videos.findFirst({
      where: eq(videos.uploadId, video.uploadId),
    });

    if (!lessonVideo) {
      return { data: null, success: false, error: 'Video not found' };
    }

    const lastLesson = await db
      .select({ position: lessons.position })
      .from(lessons)
      .where(eq(lessons.courseId, course.id))
      .orderBy(desc(lessons.position))
      .limit(1);

    const position =
      lastLesson.length > 0 ? lastLesson[0].position + 1000 : 1000;

    const [lesson] = await db
      .insert(lessons)
      .values({
        name,
        description,
        slug: createSlug(name),
        courseId: course.id,
        position,
      })
      .returning();

    await db
      .update(videos)
      .set({ lessonId: lesson.id })
      .where(eq(videos.id, lessonVideo.id));

    return { data: lesson, success: true, error: null };
  } catch (e) {
    console.error(
      'Podczas tworzenia lekcji wystąpił błąd. Spróbuj ponownie później.',
      e
    );
    return {
      data: null,
      success: false,
      error:
        'Podczas tworzenia lekcji wystąpił błąd. Spróbuj ponownie później.',
    };
  }
};

export const updateLesson = async (
  slug: string,
  { name, description, video }: CreateLesson
) => {
  try {
    const lesson = await db
      .update(lessons)
      .set({
        name,
        description,
        slug: createSlug(name),
      })
      .where(eq(lessons.slug, slug))
      .returning();

    const lessonVideo = await db.query.videos.findFirst({
      where: eq(videos.uploadId, video.uploadId),
    });

    if (!lessonVideo) {
      return { data: null, error: 'Video not found' };
    }

    await db
      .update(videos)
      .set({ lessonId: lesson[0].id })
      .where(eq(videos.id, lessonVideo.id));

    return { data: lesson, error: null };
  } catch (e) {
    if (e instanceof Error) {
      console.error('Unable to update lesson', e.message);
      return { data: null, error: e.message };
    }

    return { data: null, error: 'Unable to update lesson' };
  }
};

export const getLessonBySlug = async (slug: string) => {
  try {
    const lesson = await db.query.lessons.findFirst({
      where: eq(lessons.slug, slug),
      with: {
        video: true,
      },
    });

    if (!lesson) {
      return null;
    }

    return lesson;
  } catch (e) {
    console.error('Unable to get lesson', e);
    return null;
  }
};
