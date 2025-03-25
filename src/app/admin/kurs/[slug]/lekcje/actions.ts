'use server';

import { createSlug } from '@/lib/utils';
import { db } from '@/db';
import { lessons, courses, videos } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { mapNullsToUndefined } from '@/db/types';

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

    const video = await db.query.videos.findFirst({
      where: eq(videos.uploadId, uploadId),
    });

    const lesson = await db
      .insert(lessons)
      .values({
        name,
        description,
        slug: createSlug(name),
        courseId: course!.id,
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

export const getCourses = async () => {
  try {
    const courses = await db.query.courses.findMany();

    return courses;
  } catch (e) {
    console.error('Request error', e);
  }
};

export const getCourseBySlug = async (slug: string) => {
  try {
    const course = await db.query.courses.findFirst({
      where: eq(courses.slug, slug),
      with: {
        lessons: true,
      },
    });

    return course;
  } catch (e) {
    console.error('Request error', e);
  }
};

export const getLessonBySlug = async (slug: string) => {
  try {
    const lesson = await db.query.lessons.findFirst({
      where: eq(lessons.slug, slug),
      with: {
        videos: true,
      },
    });
    
    return mapNullsToUndefined(lesson);
  } catch (e) {
    console.error('Request error', e);
  }
};