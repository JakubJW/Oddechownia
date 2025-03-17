'use server';

import { db } from '@/db';
import { posts } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { PgSelect, PgColumn } from 'drizzle-orm/pg-core';
import { SQL, asc } from 'drizzle-orm';

type NullToUndefined<T> = {
  [K in keyof T]: T[K] extends null
    ? undefined
    : T[K] extends (infer U)[]
    ? NullToUndefined<U>[]
    : Exclude<T[K], null> | ([null] extends [T[K]] ? undefined : never);
};

export type Post = NullToUndefined<typeof posts.$inferSelect>;

export const getPosts = async (): Promise<Post[]> => {
  const data = await db.select().from(posts);

  return data.map((post) => ({
    ...post,
    shortDescription: post.shortDescription ?? undefined,
  }));
};

export const getPostBySlug = async (
  slug: string
): Promise<Post | undefined> => {
  const data = await db.query.posts.findFirst({ where: eq(posts.slug, slug) });

  if (!data) {
    return undefined;
  }

  return {
    ...data,
    shortDescription: data.shortDescription ?? undefined,
  };
};

export const getPaginatedPosts = async (page?: string) => {
  const query = db.select().from(posts);

  const data = await withPagination(query.$dynamic(), asc(posts.createdAt), Number(page));

  const [countResult] = await db
    .select({ count: sql`count(*)`.mapWith(Number).as('count') })
    .from(posts);

  return {
    posts: data.map((post) => ({
      ...post,
      shortDescription: post.shortDescription ?? undefined,
    })),
    total: countResult.count,
    perPage: 6,
  };
};

const withPagination = <T extends PgSelect>(
  qb: T,
  orderByColumn: PgColumn | SQL | SQL.Aliased,
  page = 1,
  pageSize = 6
) => {
  return qb
    .orderBy(orderByColumn)
    .limit(pageSize)
    .offset((page - 1) * pageSize);
};
