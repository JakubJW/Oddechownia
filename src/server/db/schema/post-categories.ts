import { sql } from 'drizzle-orm';
import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

export const postCategories = pgTable('post_categories', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull().unique(),
  slug: varchar('slug').notNull().unique(),
  description: text('description'),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});
