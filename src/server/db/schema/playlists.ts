import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  varchar,
} from 'drizzle-orm/pg-core';
import { videos } from './videos';
import { playlistLesson } from './playlist-lesson';
import { userLessonProgress } from './user-lessons-progress';
import { userPracticeSchedules } from './user-practice-schedules';

export const playlists = pgTable('playlists', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  description: text('description').notNull(),
  slug: varchar('slug').notNull(),
  isPublished: boolean('is_published').default(false).notNull(),
  position: integer('position').notNull(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  videoId: integer('video_id').references(() => videos.id, {
    onDelete: 'set null',
  }),
  isAccessibleForFree: boolean('is_accessible_for_free')
    .notNull()
    .default(false),
});

export const playlistRelations = relations(playlists, ({ many, one }) => ({
  playlistLessons: many(playlistLesson),
  video: one(videos, {
    fields: [playlists.videoId],
    references: [videos.id],
  }),
  scheduledPractices: many(userPracticeSchedules),
  progressRecords: many(userLessonProgress),
}));
