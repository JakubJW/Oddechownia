import { relations, sql } from 'drizzle-orm';
import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { lessons } from './lessons';
import { playlists } from './playlists';
import { users } from './users';

export const userPracticeSchedules = pgTable('user_practice_schedules', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  lessonId: integer('lesson_id')
    .notNull()
    .references(() => lessons.id),
  playlistId: integer('playlist_id')
    .notNull()
    .references(() => playlists.id),
  scheduledAt: timestamp('scheduled_at', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const userPracticeSchedulesRelations = relations(
  userPracticeSchedules,
  ({ one }) => ({
    user: one(users, {
      fields: [userPracticeSchedules.userId],
      references: [users.id],
    }),

    lesson: one(lessons, {
      fields: [userPracticeSchedules.lessonId],
      references: [lessons.id],
    }),

    playlist: one(playlists, {
      fields: [userPracticeSchedules.playlistId],
      references: [playlists.id],
    }),
  })
);
