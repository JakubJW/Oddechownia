import { pgTable, serial, varchar, text, timestamp  } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 256 }).notNull(),
  lastName: varchar('last_name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }).notNull(),
  password: varchar('password', { length: 256 }).notNull(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 256 }).notNull(),
  slug: varchar('slug', {length: 256}).notNull(),
  shortDescription: varchar('short_description', { length: 256 }),
  content: text('content').notNull(),
  thumbnailUrl: varchar('thumbnail_url', { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});