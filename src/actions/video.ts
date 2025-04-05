'use server';

import { db } from '@/db';
import { eq, and, not } from 'drizzle-orm';
import { videos } from '@/db/schema';
import { nullToUndefined } from '@/db/types';

enum Policy {
  SIGNED = 'signed',
  PUBLIC = 'public',
}

type PlaybackId = {
  id: string;
  policy: Policy;
};

export const createVideo = async ({ uploadId }: { uploadId: string }) => {
  await db.insert(videos).values({
    uploadId,
  });
};

export const handleCreatedWebhook = async ({
  uploadId,
  playbackIds,
  status,
}: {
  uploadId: string;
  playbackIds: PlaybackId[];
  status: string;
}) => {
  try {
    const publicPlaybackRow = playbackIds.find(
      (row: PlaybackId) => row.policy === Policy.PUBLIC
    );

    if (!publicPlaybackRow) {
      throw new Error('Public playback id missing');
    }

    const privatePlaybackRow = playbackIds.find(
      (row: PlaybackId) => row.policy === Policy.SIGNED
    );

    if (!privatePlaybackRow) {
      throw new Error('Private playback id missing');
    }

    await db
      .update(videos)
      .set({
        publicPlaybackId: publicPlaybackRow.id,
        privatePlaybackId: privatePlaybackRow.id,
        status,
      })
      .where(
        and(eq(videos.uploadId, uploadId), not(eq(videos.status, 'ready')))
      );
  } catch (e) {
    console.error("Webhook 'created' failed", e);
    return null;
  }
};

export const handleReadyWebkook = async ({
  uploadId,
  playbackIds,
  status,
  duration,
  aspectRatio,
}: {
  uploadId: string;
  playbackIds: PlaybackId[];
  duration: number;
  aspectRatio: string;
  status: string;
}) => {
  try {
    const publicPlaybackRow = playbackIds.find(
      (row: PlaybackId) => row.policy === Policy.PUBLIC
    );

    if (!publicPlaybackRow) {
      throw new Error('Public playback id missing');
    }

    const privatePlaybackRow = playbackIds.find(
      (row: PlaybackId) => row.policy === Policy.PUBLIC
    );

    if (!privatePlaybackRow) {
      throw new Error('Private playback id missing');
    }

    await db
      .update(videos)
      .set({
        publicPlaybackId: publicPlaybackRow.id,
        privatePlaybackId: privatePlaybackRow.id,
        duration: Math.round(duration),
        aspectRatio,
        status,
      })
      .where(eq(videos.uploadId, uploadId));
  } catch (e) {
    console.error("Webhook 'ready' failed", e);
    return null;
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
