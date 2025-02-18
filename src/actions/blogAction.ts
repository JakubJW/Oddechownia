"use server";

import { db } from "@/db";
import { posts } from "@/db/schema";

export const getData = async () => {
  const data = await db.select().from(posts);
  return data;
};
