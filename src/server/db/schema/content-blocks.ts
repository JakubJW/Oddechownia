import { sql } from 'drizzle-orm';
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
} from 'drizzle-orm/pg-core';

export const contentBlocks = pgTable('content_blocks', {
  id: serial('id').primaryKey(),
  pageSlug: text('page_slug').notNull().default('/'),
  type: text('type').notNull(),
  content: jsonb('content').notNull(),
  orderIndex: integer('order_index').notNull().default(0),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});
