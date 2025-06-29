'use server';

import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { videos } from '@/db/schema';
import { nullToUndefined } from '@/db/types';

type ActionResult<T> = {
  data: T | null;
  error: any;
};

export const createVideo = async ({
  uploadId,
}: {
  uploadId: string;
}): Promise<ActionResult<(typeof videos.$inferInsert)[]>> => {
  try {
    const video = await db
      .insert(videos)
      .values({
        uploadId,
      })
      .returning();

    return { data: video, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const deleteVideo = async ({ uploadId }: { uploadId: string }) => {
  try {
    await db.delete(videos).where(eq(videos.uploadId, uploadId));
  } catch (e) {
    console.error('Unable to delete video', e);
  }
};

export const getVideoByPlaybackId = async (playbackId: string) => {
  try {
    const video = await db.query.videos.findFirst({
      where: eq(videos.publicPlaybackId, playbackId),
    });

    if (!video) {
      return null;
    }

    return nullToUndefined(video);
  } catch (e) {
    console.error('Unable to get video', e);
    return null;
  }
};
