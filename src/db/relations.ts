import { relations } from 'drizzle-orm';
import { lessons, courses, videos } from './schema';

export const lessonsRelations = relations(lessons, ({ one }) => ({
  course: one(courses, {
    fields: [lessons.courseId],
    references: [courses.id],
  }),
  video: one(videos, {
    fields: [lessons.id],
    references: [videos.lessonId],
  }),
}));

export const videosRelations = relations(videos, ({ one }) => ({
  lesson: one(lessons, {
    fields: [videos.lessonId],
    references: [lessons.id],
  }),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  lessons: many(lessons),
}));
