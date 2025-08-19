'use server';

import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { videos } from '@/db/schema';
import { nullToUndefined } from '@/db/types';
import { ActionResult } from './types';
import { BaseVideo } from '@/db/types';

export const createVideo = async ({
  uploadId,
}: {
  uploadId: string;
}): Promise<ActionResult<BaseVideo>> => {
  try {
    const [video] = await db
      .insert(videos)
      .values({
        uploadId,
      })
      .returning();

    return { data: video, success: true, error: null };
  } catch (error) {
    console.error(
      'Podczas tworzenia filmu wystąpił błąd. Spróbuj ponownie później.',
      error
    );
    return {
      data: null,
      success: false,
      error: 'Podczas tworzenia filmu wystąpił błąd. Spróbuj ponownie później.',
    };
  }
};

export const deleteVideo = async (uploadId: string) => {
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
