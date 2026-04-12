import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { lessons } from './lessons';
import { playlists } from './playlists';

export const videos = pgTable('videos', {
  id: serial('id').primaryKey(),
  uploadId: varchar('upload_id').unique().notNull(),
  publicPlaybackId: varchar('public_playback_id'),
  privatePlaybackId: varchar('private_playback_id'),
  duration: integer('duration'),
  aspectRatio: varchar('aspect_ratio'),
  status: varchar().default('preparing').notNull(),
  assetId: varchar('asset_id'),
});

export const videosRelations = relations(videos, ({ one }) => ({
  lesson: one(lessons, {
    fields: [videos.id],
    references: [lessons.videoId],
  }),
  playlist: one(playlists, {
    fields: [videos.id],
    references: [playlists.videoId],
  }),
}));
