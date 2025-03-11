import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";

const takeUniqueOrThrow = <T>(values: T[]): T => {
    if (values.length !== 1)
        throw new Error("Found non unique or inexistent value");
    return values[0]!;
};

export const getPosts = async () => {
    const data = await db.select().from(posts);

    return data;
}

export const getPostBySlug = async (slug: string) => {
    const data = await db.select().from(posts).where(eq(posts.slug, slug)).then(takeUniqueOrThrow);

    return data;
}