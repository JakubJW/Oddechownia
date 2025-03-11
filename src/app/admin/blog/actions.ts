'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/supabase/server'
import { db } from '@/db';
import { posts } from '@/db/schema';
import slugify from 'slugify'

export async function createPost(formData: FormData) {
	const supabase = await createClient()

	const file: File | null = formData.get('thumbnail') as unknown as File;

	const { data: responseData, error } = await supabase.storage.from(process.env.NEXT_WEBSITE_ASSETS_BUCKET_ID!).upload(`post-thumbnails/${file.name}`, file, {
		cacheControl: '3600',
		upsert: true
	})

	const { data: thumbnailUrl } = supabase.storage.from(process.env.NEXT_WEBSITE_ASSETS_BUCKET_ID!).getPublicUrl(responseData?.path);

	await db.insert(posts).values({
		title: formData.get('title') as string,
		slug: slugify(formData.get('title') as string, {
			lower: true
		}),
		shortDescription: formData.get('shortDescription') as string,
		content: formData.get('content') as string,
		thumbnailUrl: thumbnailUrl.publicUrl,
	});

	revalidatePath('/admin/blog');
	redirect('/admin/blog');
}