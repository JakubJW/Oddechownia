import { integer, pgTable, serial } from 'drizzle-orm/pg-core';
import { lessons } from './lessons';
import { relations } from 'drizzle-orm';
import { files } from './files';

export const attachments = pgTable('attachments', {
  id: serial('id').primaryKey(),
  lessonId: integer('lesson_id')
    .notNull()
    .references(() => lessons.id, {
      onDelete: 'cascade',
    }),
  fileId: integer('file_id')
    .notNull()
    .references(() => files.id, { onDelete: 'cascade' }),
});

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  lesson: one(lessons, {
    fields: [attachments.lessonId],
    references: [lessons.id],
  }),
  file: one(files, {
    fields: [attachments.fileId],
    references: [files.id],
  }),
}));
