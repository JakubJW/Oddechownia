import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { files } from './files';
import { postCategories } from './post-categories';
import { users } from './users';
import { comments } from './comments';

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  authorId: uuid('author_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  slug: text('slug').notNull().unique(),
  shortDescription: varchar('short_description'),
  imageId: integer('image_id').references(() => files.id, {
    onDelete: 'set null',
  }),
  isPublished: boolean('is_published').default(false).notNull(),
  publishedAt: timestamp('published_at', { mode: 'string' }),
  categoryId: integer('category_id').references(() => postCategories.id, {
    onDelete: 'set null',
  }),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
  comments: many(comments),
}));
