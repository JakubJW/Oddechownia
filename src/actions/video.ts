'use server';

import { db } from '@/db';
import { eq, and, not } from 'drizzle-orm';
import { videos } from '@/db/schema';
import { nullToUndefined } from '@/db/types';

type PlaybackId = {
  id: string;
  policy: 'signed' | 'public';
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
      (row: PlaybackId) => row.policy === 'public'
    );

    if (!publicPlaybackRow) {
      throw new Error('Public playback id missing');
    }

    const privatePlaybackRow = playbackIds.find(
      (row: PlaybackId) => row.policy === 'signed'
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
  } catch (error) {
    console.log(error);
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
      (row: PlaybackId) => row.policy === 'public'
    );

    if (!publicPlaybackRow) {
      throw new Error('Public playback id missing');
    }

    const privatePlaybackRow = playbackIds.find(
      (row: PlaybackId) => row.policy === 'signed'
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
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteVideo = async ({ uploadId }: { uploadId: string }) => {
  await db.delete(videos).where(eq(videos.uploadId, uploadId));
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
    console.error('Request error', e);
    return null;
  }
};
