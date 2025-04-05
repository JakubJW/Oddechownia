'use server';

import slugify from 'slugify';
import { db } from '@/db';
import { courses, lessons, videos } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { createSlug } from '@/lib/utils';

interface CreateCourse {
  name: string;
  description: string;
  isPublished: boolean;
}

export const createCourse = async ({
  name,
  description,
  isPublished,
}: CreateCourse) => {
  try {
    const course = await db
      .insert(courses)
      .values({
        name,
        description,
        slug: slugify(name, { lower: true, strict: true }),
        isPublished: isPublished,
      })
      .returning();

    return course[0];
  } catch (e) {
    console.error('Unable to create course', e);
    return null;
  }
};

export const updateCourse = async (
  slug: string,
  { name, description, isPublished }: CreateCourse
) => {
  try {
    const course = await db
      .update(courses)
      .set({
        name,
        description,
        slug: createSlug(name),
        isPublished,
      })
      .where(eq(courses.slug, slug))
      .returning();

    return course[0];
  } catch (e) {
    console.error('Unable to update course', e);
    return null;
  }
};

export const getCourses = async (options?: { published: boolean }) => {
  try {
    const data = await db.query.courses.findMany({
      with: {
        lessons: {
          with: {
            video: true,
          },
          orderBy: (lessons, { asc }) => [asc(lessons.position)],
        },
      },
      where: options?.published ? eq(courses.isPublished, options.published) : undefined,
    });

    const lessonCounts = await db
      .select({
        courseId: courses.id,
        lessonCount: sql<number>`COUNT(${lessons.id})::FLOAT`.as('lessonCount'),
      })
      .from(courses)
      .leftJoin(lessons, eq(courses.id, lessons.courseId))
      .groupBy(courses.id);

    const durations = await db
      .select({
        courseId: courses.id,
        totalDuration:
          sql<number>`COALESCE(SUM(${videos.duration}::numeric), 0)::FLOAT`.as(
            'totalDuration'
          ),
      })
      .from(courses)
      .leftJoin(lessons, eq(courses.id, lessons.courseId))
      .leftJoin(videos, eq(lessons.id, videos.lessonId))
      .groupBy(courses.id);

    const coursesWithCounts = data.map((course) => ({
      ...course,
      lessonCount:
        lessonCounts.find(({ courseId }) => courseId === course.id)
          ?.lessonCount || 0,
      totalDuration:
        durations.find(({ courseId }) => courseId === course.id)
          ?.totalDuration || 0,
    }));

    return coursesWithCounts;
  } catch (e) {
    console.error('Unable to get courses', e);
    return null;
  }
};

export const getCourseBySlug = async (slug: string) => {
  try {
    const course = await db.query.courses.findFirst({
      where: eq(courses.slug, slug),
      with: {
        lessons: {
          with: { video: true },
          orderBy: (lessons, { asc }) => [asc(lessons.position)],
        },
      },
    });

    if (!course) return null;

    const lessonCounts = await db
      .select({
        courseId: courses.id,
        lessonCount: sql<number>`COUNT(${lessons.id})::FLOAT`.as('lessonCount'),
      })
      .from(courses)
      .leftJoin(lessons, eq(courses.id, lessons.courseId))
      .groupBy(courses.id);

    const durations = await db
      .select({
        courseId: courses.id,
        totalDuration:
          sql<number>`COALESCE(SUM(${videos.duration}::numeric), 0)::FLOAT`.as(
            'totalDuration'
          ),
      })
      .from(courses)
      .leftJoin(lessons, eq(courses.id, lessons.courseId))
      .leftJoin(videos, eq(lessons.id, videos.lessonId))
      .groupBy(courses.id);

    return {
      ...course,
      lessonCount:
        lessonCounts.find((lc) => lc.courseId === course.id)?.lessonCount || 0,
      totalDuration:
        durations.find((d) => d.courseId === course.id)?.totalDuration || 0,
    };
  } catch (e) {
    console.error('Unable to get course', e);
    return null;
  }
};
