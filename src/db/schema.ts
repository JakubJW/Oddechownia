import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
} from 'drizzle-orm/pg-core';

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
  slug: varchar('slug', { length: 256 }).notNull(),
  shortDescription: varchar('short_description', { length: 256 }),
  content: text('content').notNull(),
  thumbnailUrl: varchar('thumbnail_url', { length: 256 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  description: varchar('description', { length: 256 }).notNull(),
  slug: varchar('slug', { length: 256 }).notNull(),
  isPublished: boolean('is_published').notNull(),
});

export const lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  description: varchar('description', { length: 256 }).notNull(),
  slug: varchar('slug', { length: 256 }).notNull(),
  courseId: integer('course_id')
    .references(() => courses.id, { onDelete: 'cascade' })
    .notNull(),
});

export const videos = pgTable('videos', {
  id: serial('id').primaryKey(),
  lessonId: integer('lesson_id').references(() => lessons.id, {
    onDelete: 'cascade',
  }),
  uploadId: varchar('upload_id').unique().notNull(),
  publicPlaybackId: varchar('public_playback_id'),
  privatePlaybackId: varchar('private_playback_id'),
  duration: decimal('duration'),
  aspectRatio: varchar('aspect_ratio'),
  status: varchar().default('preparing').notNull(),
});
