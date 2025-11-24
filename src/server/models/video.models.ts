import { InferSelectModel } from 'drizzle-orm';
import { videos } from '../db/schema';

export type VideoSchema = InferSelectModel<typeof videos>;
export type VideoBaseDTO = Omit<
  VideoSchema,
  | 'publicPlaybackId'
  | 'privatePlaybackId'
  | 'assetId'
  | 'duration'
  | 'aspectRatio'
>;

export type VideoDTO = VideoBaseDTO & {
  publicPlaybackId?: string;
  privatePlaybackId?: string;
  duration?: number;
  aspectRatio?: string;
  assetId?: string;
};
