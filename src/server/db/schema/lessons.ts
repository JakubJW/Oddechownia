import { relations, sql } from 'drizzle-orm';
import { pgTable, integer, serial, varchar, text } from 'drizzle-orm/pg-core';
import { videos } from './videos';
import { files } from './files';
import { attachments } from './attachments';
import { comments } from './comments';
import { lessonLabels } from './lesson-labels';
import { playlistLesson } from './playlist-lesson';
import { userFavoriteLessons } from './user-favorite-lessons';
import { userLessonProgress } from './user-lessons-progress';
import { userPracticeSchedules } from './user-practice-schedules';

export const lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  description: varchar('description').notNull(),
  slug: varchar('slug').notNull(),
  videoId: integer('video_id').references(() => videos.id, {
    onDelete: 'set null',
  }),
  thumbnailId: integer('thumbnail_id')
    .notNull()
    .references(() => files.id, { onDelete: 'restrict' }),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  playlistLessons: many(playlistLesson),
  video: one(videos, {
    fields: [lessons.videoId],
    references: [videos.id],
  }),
  attachments: many(attachments),
  comments: many(comments),
  thumbnail: one(files, {
    fields: [lessons.thumbnailId],
    references: [files.id],
  }),
  userFavoriteLessons: many(userFavoriteLessons),
  scheduledPractices: many(userPracticeSchedules),
  progressRecords: many(userLessonProgress),
  labels: many(lessonLabels),
}));
