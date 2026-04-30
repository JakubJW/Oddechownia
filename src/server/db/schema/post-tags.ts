import { sql } from 'drizzle-orm';
import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

export const postTags = pgTable('post_tags', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull().unique(),
  slug: varchar('slug').notNull().unique(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});
