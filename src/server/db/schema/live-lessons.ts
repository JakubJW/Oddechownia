import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { liveLessonsRegistrations, products } from '../schema';
import { files } from './files';

export const liveLessons = pgTable('live_lessons', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title').notNull(),
  scheduledAt: timestamp('scheduled_at', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
  duration: integer('duration').notNull(),
  isListed: boolean('is_listed').notNull().default(false),
  isPublished: boolean('is_published').notNull().default(false),
  isCompleted: boolean('is_completed').notNull().default(false),
  description: text('description'),
  meetingLink: text('meeting_link'),
  recordingUrl: text('recording_url'),
  thumbnailId: integer('thumbnail_id').references(() => files.id, {
    onDelete: 'set null',
  }),
  productId: uuid('product_id')
    .references(() => products.id)
    .unique(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const liveLessonsRelations = relations(liveLessons, ({ many, one }) => ({
  liveLessonsRegistrations: many(liveLessonsRegistrations),
  thumbnail: one(files, {
    fields: [liveLessons.thumbnailId],
    references: [files.id],
  }),
  product: one(products, {
    fields: [liveLessons.productId],
    references: [products.id],
  }),
}));
