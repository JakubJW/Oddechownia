import { relations, sql } from 'drizzle-orm';
import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { attachments } from './attachments';
import { lessons } from './lessons';
import { liveLessons } from './live-lessons';
import { products } from './products';

export const files = pgTable('files', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  originalName: varchar('original_name').notNull(),
  mimeType: varchar('mime_type').notNull(),
  bucket: varchar().notNull(),
  path: varchar().notNull(),
  uploadStatus: varchar('upload_status'),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const filesRelations = relations(files, ({ one }) => ({
  attachment: one(attachments, {
    fields: [files.id],
    references: [attachments.fileId],
  }),
  lesson: one(lessons, {
    fields: [files.id],
    references: [lessons.thumbnailId],
  }),
  liveLesson: one(liveLessons, {
    fields: [files.id],
    references: [liveLessons.thumbnailId],
  }),
  product: one(products, {
    fields: [files.id],
    references: [products.imageId],
  }),
}));
