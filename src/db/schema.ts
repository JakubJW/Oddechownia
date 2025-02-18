import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
  phone: varchar('phone', { length: 256 }),
});

export const posts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  title: varchar('title'),
  slug: varchar('slug', { length: 256 }),
  content: text('content'),
  thumbnail: varchar('thumbnail', { length: 256 }),
  createdAt: timestamp('created_at'),
});