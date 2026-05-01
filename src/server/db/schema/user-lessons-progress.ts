import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';
import { lessons } from './lessons';
import { playlists } from './playlists';
import { users } from './users';
import { relations } from 'drizzle-orm';

export const userLessonProgress = pgTable(
  'user_lesson_progress',
  {
    id: serial('id').primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    lessonId: integer('lesson_id')
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    playlistId: integer('playlist_id').references(() => playlists.id, {
      onDelete: 'set null',
    }),
    isCompleted: boolean('is_completed').default(false).notNull(),
    lastPositionSeconds: integer('last_position_seconds').default(0).notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique('unique_user_lesson_constratint').on(table.userId, table.lessonId),
  ]
);

export const userLessonProgressRelations = relations(
  userLessonProgress,
  ({ one }) => ({
    user: one(users, {
      fields: [userLessonProgress.userId],
      references: [users.id],
    }),
    lesson: one(lessons, {
      fields: [userLessonProgress.lessonId],
      references: [lessons.id],
    }),
    playlist: one(playlists, {
      fields: [userLessonProgress.playlistId],
      references: [playlists.id],
    }),
  })
);
