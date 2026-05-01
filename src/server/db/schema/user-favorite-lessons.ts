import { relations, sql } from 'drizzle-orm';
import { integer, pgTable, serial, text, uuid } from 'drizzle-orm/pg-core';
import { lessons } from './lessons';
import { users } from './users';

export const userFavoriteLessons = pgTable('user_favorite_lessons', {
  id: serial().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  lessonId: integer('lesson_id')
    .notNull()
    .references(() => lessons.id, { onDelete: 'cascade' }),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const userFavoriteLessonsRelations = relations(
  userFavoriteLessons,
  ({ one }) => ({
    user: one(users, {
      fields: [userFavoriteLessons.userId],
      references: [users.id],
    }),
    lesson: one(lessons, {
      fields: [userFavoriteLessons.lessonId],
      references: [lessons.id],
    }),
  })
);
