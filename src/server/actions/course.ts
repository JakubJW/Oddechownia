// 'use server';

// import { db } from '@/db';
// import { courses, lessons, videos } from '@/db/schema';
// import { eq } from 'drizzle-orm';
// import { sql } from 'drizzle-orm';
// import { createSlug } from '@/lib/utils';
// import { stripeService } from '@/services/stripe';
// import { Course } from '@/db/types';
// import { ActionResult } from './types';
// import { revalidatePath } from 'next/cache';

// interface CreateCourse {
//   name: string;
//   description: string;
//   isPublished: boolean;
//   isOneOff: boolean;
//   priceInCents?: number;
// }

// export const createCourse = async ({
//   name,
//   description,
//   isPublished,
//   isOneOff,
//   priceInCents,
// }: CreateCourse): Promise<ActionResult<Course>> => {
//   try {
//     if (!isOneOff) {
//       const [course] = await db
//         .insert(courses)
//         .values({
//           name,
//           description,
//           slug: createSlug(name),
//           isPublished,
//           isOneOff,
//         })
//         .returning();

//       return { data: course, success: true, error: null };
//     }

//     const product = await stripeService.createProduct({
//       name,
//       description,
//       metadata: {
//         priceType: 'one-off',
//       },
//     });

//     const price = await stripeService.createPrice({
//       product: product.id,
//       unit_amount: priceInCents,
//       currency: 'pln',
//     });

//     const [course] = await db
//       .insert(courses)
//       .values({
//         name,
//         description,
//         slug: createSlug(name),
//         isPublished,
//         isOneOff,
//         priceInCents,
//         stripePriceId: price.id,
//       })
//       .returning();

//     return { data: course, success: true, error: null };
//   } catch (e) {
//     console.error('Unable to create course', e);
//     return {
//       data: null,
//       success: false,
//       error: 'Podczas tworzenia kursu wystąpił błąd. Spróbuj ponownie później.',
//     };
//   }
// };

// export const updateCourse = async (
//   slug: string,
//   { name, description, isPublished, isOneOff, priceInCents }: CreateCourse
// ) => {
//   try {
//     const [course] = await db
//       .update(courses)
//       .set({
//         name,
//         description,
//         slug: createSlug(name),
//         isPublished,
//         isOneOff,
//         priceInCents: priceInCents ?? null,
//       })
//       .where(eq(courses.slug, slug))
//       .returning();

//     revalidatePath(`/admin/kurs/${course.slug}`);
//     return { data: course, success: true, error: null };
//   } catch (e) {
//     console.error('Unable to update course', e);
//     return {
//       data: null,
//       success: false,
//       error: 'Podczas edycji kursu wystąpił błąd. Spróbuj ponownie później.',
//     };
//   }
// };

// export const getCourses = async (options?: { published: boolean }) => {
//   try {
//     const data = await db.query.courses.findMany({
//       with: {
//         lessons: {
//           with: {
//             video: true,
//           },
//         },
//       },
//       where: options?.published
//         ? eq(courses.isPublished, options.published)
//         : undefined,
//     });

//     const lessonCounts = await db
//       .select({
//         courseId: courses.id,
//         lessonCount: sql<number>`COUNT(${lessons.id})::FLOAT`.as('lessonCount'),
//       })
//       .from(courses)
//       .leftJoin(lessons, eq(courses.id, lessons.courseId))
//       .groupBy(courses.id);

//     const durations = await db
//       .select({
//         courseId: courses.id,
//         totalDuration:
//           sql<number>`COALESCE(SUM(${videos.duration}::numeric), 0)::FLOAT`.as(
//             'totalDuration'
//           ),
//       })
//       .from(courses)
//       .leftJoin(lessons, eq(courses.id, lessons.courseId))
//       .leftJoin(videos, eq(lessons.id, videos.lessonId))
//       .groupBy(courses.id);

//     const coursesWithCounts = data.map((course) => ({
//       ...course,
//       lessonCount:
//         lessonCounts.find(({ courseId }) => courseId === course.id)
//           ?.lessonCount || 0,
//       totalDuration:
//         durations.find(({ courseId }) => courseId === course.id)
//           ?.totalDuration || 0,
//     }));

//     return coursesWithCounts;
//   } catch (e) {
//     console.error('Unable to get courses', e);
//     return null;
//   }
// };

// export const getCourseBySlug = async (slug: string) => {
//   try {
//     const course = await db.query.courses.findFirst({
//       where: eq(courses.slug, slug),
//       with: {
//         lessons: {
//           with: { video: true },
//           orderBy: (lessons, { asc }) => [asc(lessons.position)],
//         },
//       },
//     });

//     if (!course) return null;

//     const lessonCounts = await db
//       .select({
//         courseId: courses.id,
//         lessonCount: sql<number>`COUNT(${lessons.id})::FLOAT`.as('lessonCount'),
//       })
//       .from(courses)
//       .leftJoin(lessons, eq(courses.id, lessons.courseId))
//       .groupBy(courses.id);

//     const durations = await db
//       .select({
//         courseId: courses.id,
//         totalDuration:
//           sql<number>`COALESCE(SUM(${videos.duration}::numeric), 0)::FLOAT`.as(
//             'totalDuration'
//           ),
//       })
//       .from(courses)
//       .leftJoin(lessons, eq(courses.id, lessons.courseId))
//       .leftJoin(videos, eq(lessons.id, videos.lessonId))
//       .groupBy(courses.id);

//     return {
//       ...course,
//       lessonCount:
//         lessonCounts.find((lc) => lc.courseId === course.id)?.lessonCount || 0,
//       totalDuration:
//         durations.find((d) => d.courseId === course.id)?.totalDuration || 0,
//     };
//   } catch (e) {
//     console.error('Unable to get course', e);
//     return null;
//   }
// };

// export const deleteCourse = async (id: number) => {
//   try {
//     await db.delete(courses).where(eq(courses.id, id));
//   } catch (e) {
//     console.error('Unable to delete course', e);
//     return;
//   }
// };
