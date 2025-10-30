import { InferSelectModel } from 'drizzle-orm';
import { files } from '../db/schema';

export type FileSchema = InferSelectModel<typeof files>;
export type FileBaseDTO = Omit<
  FileSchema,
  'publicPlaybackId' | 'privatePlaybackId' | 'duration' | 'aspectRatio'
>;

export type FileDTO = FileBaseDTO & {
  publicPlaybackId?: string;
  privatePlaybackId?: string;
  duration?: number;
  aspectRatio?: string;
};
