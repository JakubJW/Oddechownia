import { integer, pgTable, serial, unique } from 'drizzle-orm/pg-core';
import { lessons } from './lessons';
import { playlists } from './playlists';
import { relations } from 'drizzle-orm';

export const playlistLesson = pgTable(
  'playlist_lesson',
  {
    id: serial('id').primaryKey(),
    lessonId: integer('lesson_id')
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    playlistId: integer('playlist_id')
      .notNull()
      .references(() => playlists.id, { onDelete: 'cascade' }),
    position: integer('position').notNull(),
  },
  (table) => [
    unique('unique_playlist_lesson_constraint').on(
      table.lessonId,
      table.playlistId
    ),
  ]
);

export const playlistLessonRelations = relations(playlistLesson, ({ one }) => ({
  lesson: one(lessons, {
    fields: [playlistLesson.lessonId],
    references: [lessons.id],
  }),
  playlist: one(playlists, {
    fields: [playlistLesson.playlistId],
    references: [playlists.id],
  }),
}));
