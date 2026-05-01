import { integer, pgTable, serial, unique } from 'drizzle-orm/pg-core';
import { labels } from './labels';
import { lessons } from './lessons';
import { relations } from 'drizzle-orm';

export const lessonLabels = pgTable(
  'lesson_labels',
  {
    id: serial('id').primaryKey(),
    lessonId: integer('lesson_id')
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    labelId: integer('label_id')
      .notNull()
      .references(() => labels.id, { onDelete: 'cascade' }),
  },
  (t) => [unique('unique_label_lesson_constraint').on(t.labelId, t.lessonId)]
);

export const lessonLabelsRelations = relations(lessonLabels, ({ one }) => ({
  lesson: one(lessons, {
    fields: [lessonLabels.lessonId],
    references: [lessons.id],
  }),
  label: one(labels, {
    fields: [lessonLabels.labelId],
    references: [labels.id],
  }),
}));
