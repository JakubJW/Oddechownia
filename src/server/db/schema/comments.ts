import { relations, sql } from 'drizzle-orm';
import {
  check,
  foreignKey,
  integer,
  pgTable,
  serial,
  text,
  uuid,
} from 'drizzle-orm/pg-core';
import { lessons } from './lessons';
import { users } from './users';
import { posts } from './posts';

export const comments = pgTable(
  'comments',
  {
    id: serial('id').primaryKey(),
    lessonId: integer('lesson_id').references(() => lessons.id, {
      onDelete: 'cascade',
    }),
    postId: integer('post_id').references(() => posts.id, {
      onDelete: 'cascade',
    }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    content: text('content').notNull(),
    parentId: integer('parent_id'),
    createdAt: text('created_at')
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    updatedAt: text('updated_at')
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull()
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => [
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
      name: 'comments_underlying_id_fk',
    }).onDelete('cascade'),
    check(
      'comment_parent_check',
      sql`
        (${table.lessonId} IS NOT NULL AND ${table.postId} IS NULL) OR 
        (${table.lessonId} IS NULL AND ${table.postId} IS NOT NULL)
      `
    ),
  ]
);

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [comments.lessonId],
    references: [lessons.id],
  }),
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: 'child_comments',
  }),
  replies: many(comments, {
    relationName: 'child_comments',
  }),
}));
