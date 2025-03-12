'use server';

import { db } from '@/db';
import { posts } from '@/db/schema';
import { createClient } from '@/supabase/server';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import slugify from 'slugify';
import { z } from 'zod';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export async function createPost(formData: FormData) {
  const supabase = await createClient();

  const schema = z.object({
    title: z.string(),
    shortDescription: z.string(),
    content: z.string(),
    thumbnail: z
      .any()
      .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
        'Only .jpg, .jpeg, .png and .webp formats are supported.'
      ),
  });

  const parse = schema.safeParse({
    title: formData.get('title'),
    shortDescription: formData.get('shortDescription'),
    content: formData.get('content'),
    thumbnail: formData.get('thumbnail'),
  });

  if (!parse.success) {
    return { message: 'Failed to create todo' };
  }

  const { title, shortDescription, content, thumbnail } = parse.data;

  const file: File | null = thumbnail as unknown as File;

  const { data: responseData, error } = await supabase.storage
    .from(process.env.NEXT_WEBSITE_ASSETS_BUCKET_ID!)
    .upload(`post-thumbnails/${file.name}`, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    return { message: error.message };
  }

  const { data: thumbnailUrl } = supabase.storage
    .from(process.env.NEXT_WEBSITE_ASSETS_BUCKET_ID!)
    .getPublicUrl(responseData.path);

  await db.insert(posts).values({
    title,
    slug: slugify(title, {
      lower: true,
    }),
    shortDescription,
    content,
    thumbnailUrl: thumbnailUrl.publicUrl,
  });

  revalidatePath('/admin/blog');
  redirect('/admin/blog');
}

export async function updatePost(id: number, formData: FormData) {
  const supabase = await createClient();

  const file: File | null = formData.get('thumbnail') as unknown as File;

  if (file) {
    const { data: responseData, error } = await supabase.storage
      .from(process.env.NEXT_WEBSITE_ASSETS_BUCKET_ID!)
      .upload(`post-thumbnails/${file.name}`, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      return { message: error.message };
    }

    const { data: thumbnailUrl } = supabase.storage
      .from(process.env.NEXT_WEBSITE_ASSETS_BUCKET_ID!)
      .getPublicUrl(responseData.path);

    await db
      .update(posts)
      .set({
        thumbnailUrl: thumbnailUrl.publicUrl,
      })
      .where(eq(posts.id, id));
  }

  await db
    .update(posts)
    .set({
      title: formData.get('title') as string,
      slug: slugify(formData.get('title') as string, {
        lower: true,
      }),
      shortDescription: formData.get('shortDescription') as string,
      content: formData.get('content') as string,
    })
    .where(eq(posts.id, id));

  revalidatePath('/admin/blog');
  redirect('/admin/blog');
}
