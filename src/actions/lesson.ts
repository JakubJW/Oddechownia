'use server';

import { createSlug } from '@/lib/utils';
import { db } from '@/db';
import { eq, desc } from 'drizzle-orm';
import { courses, lessons, videos } from '@/db/schema';

interface CreateLesson {
  name: string;
  description: string;
  uploadId: string;
  courseSlug: string;
}

export const createLesson = async ({
  name,
  description,
  uploadId,
  courseSlug,
}: CreateLesson) => {
  try {
    const course = await db.query.courses.findFirst({
      where: eq(courses.slug, courseSlug),
    });

    if (!course) return null;

    const video = await db.query.videos.findFirst({
      where: eq(videos.uploadId, uploadId),
    });

    const lastLesson = await db
      .select({ position: lessons.position })
      .from(lessons)
      .where(eq(lessons.courseId, course.id))
      .orderBy(desc(lessons.position))
      .limit(1);

    const position =
      lastLesson.length > 0 ? lastLesson[0].position + 1000 : 1000;

    const lesson = await db
      .insert(lessons)
      .values({
        name,
        description,
        slug: createSlug(name),
        courseId: course!.id,
        position,
      })
      .returning({ slug: lessons.slug, id: lessons.id });

    await db
      .update(videos)
      .set({ lessonId: lesson[0].id })
      .where(eq(videos.id, video!.id));

    return lesson;
  } catch (e) {
    console.error('Request error', e);
  }
};

export const updateLesson = async (
  slug: string,
  { name, description }: CreateLesson
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
      .returning({ slug: lessons.slug });

    return lesson;
  } catch (e) {
    console.error('Request error', e);
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

    return lesson;
  } catch (e) {
    console.error('Request error', e);
  }
};
