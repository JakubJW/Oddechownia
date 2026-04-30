import { relations } from 'drizzle-orm';
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { lessonLabels } from './lesson-labels';

export const labels = pgTable('labels', {
  id: serial('id').primaryKey(),
  text: varchar('text', { length: 50 }).notNull().unique(),
  color: varchar('color', { length: 20 }).notNull(),
});

export const labelsRelations = relations(labels, ({ many }) => ({
  lessons: many(lessonLabels),
}));
