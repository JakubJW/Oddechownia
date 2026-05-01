import { integer, pgTable, serial, unique } from 'drizzle-orm/pg-core';
import { postTags } from './post-tags';
import { posts } from './posts';

export const postTag = pgTable(
  'post_tag',
  {
    id: serial('id').primaryKey(),
    postId: integer('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    tagId: integer('tag_id')
      .notNull()
      .references(() => postTags.id, { onDelete: 'cascade' }),
  },
  (table) => [
    unique('unique_post_tag_constraint').on(table.postId, table.tagId),
  ]
);
