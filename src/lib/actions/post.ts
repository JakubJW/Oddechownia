'use server';

import { db } from '@/db';
import { posts } from '@/db/schema';
import { eq } from 'drizzle-orm';

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

export const getPostBySlug = async (slug: string): Promise<Post | undefined> => {
  const data = await db.query.posts.findFirst({ where: eq(posts.slug, slug) });

  if (!data) {
    return undefined;
  }

  return {
    ...data,
    shortDescription: data.shortDescription ?? undefined,
  };
};
