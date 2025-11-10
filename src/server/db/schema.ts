import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  uuid,
  unique,
  foreignKey,
} from 'drizzle-orm/pg-core';
import { UserRoles } from './consts';
import { sql } from 'drizzle-orm';

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 256 }).notNull(),
  slug: varchar('slug', { length: 256 }).notNull(),
  shortDescription: varchar('short_description', { length: 256 }),
  content: text('content').notNull(),
  thumbnailUrl: varchar('thumbnail_url', { length: 256 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  description: varchar('description').notNull(),
  slug: varchar('slug').notNull(),
  videoId: integer('video_id').references(() => videos.id, {
    onDelete: 'set null',
  }),
  thumbnailId: integer('thumbnail_id')
    .notNull()
    .references(() => files.id, { onDelete: 'cascade' }),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const videos = pgTable('videos', {
  id: serial('id').primaryKey(),
  uploadId: varchar('upload_id').unique().notNull(),
  publicPlaybackId: varchar('public_playback_id'),
  privatePlaybackId: varchar('private_playback_id'),
  duration: integer('duration'),
  aspectRatio: varchar('aspect_ratio'),
  status: varchar().default('preparing').notNull(),
});

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  role: varchar('role').default(UserRoles.USER),
  firstName: varchar('first_name'),
  lastName: varchar('last_name'),
  email: varchar('email').notNull(),
  regulationsAgreement: boolean('regulations_agreement').default(false),
  privacyPolicyAgreement: boolean('privacy_policy_agreement').default(false),
  stripeCustomerId: varchar('stripe_customer_id'),
  subscriptionStatus: varchar(''),
});

export const userSubscription = pgTable('user_subscription', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  status: varchar('status'),
  stripeSubscriptionId: text('stripe_subscription_id').unique().notNull(),
  currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),
});

export const playlists = pgTable('playlists', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  description: text('description').notNull(),
  slug: varchar('slug').notNull(),
  isPublished: boolean('is_published').default(false).notNull(),
  position: integer('position').notNull(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  videoId: integer('video_id').references(() => videos.id, {
    onDelete: 'set null',
  }),
});

export const playlistLesson = pgTable(
  'playlist_lesson',
  {
    id: serial('id').primaryKey(),
    lessonId: integer('lesson_id')
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    playlistId: integer('playlist_id')
      .notNull()
      .references(() => playlists.id, { onDelete: 'cascade' }),
    position: integer('position').notNull(),
  },
  (table) => [
    unique('unique_playlist_lesson_constraint').on(
      table.lessonId,
      table.playlistId
    ),
  ]
);

export const waitlist = pgTable('waitlist', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name').notNull(),
  email: varchar('email').unique().notNull(),
  emailMarketingAgreement: boolean('email_marketing_agreement').default(false),
});

export const attachments = pgTable('attachments', {
  id: serial('id').primaryKey(),
  lessonId: integer('lesson_id')
    .notNull()
    .references(() => lessons.id, {
      onDelete: 'cascade',
    }),
  fileId: integer('file_id')
    .notNull()
    .references(() => files.id, { onDelete: 'cascade' }),
});

export const files = pgTable('files', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  originalName: varchar('original_name').notNull(),
  mimeType: varchar('mime_type').notNull(),
  bucket: varchar().notNull(),
  path: varchar().notNull(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const comments = pgTable(
  'comments',
  {
    id: serial('id').primaryKey(),
    lessonId: integer('lesson_id')
      .notNull()
      .references(() => lessons.id, {
        onDelete: 'cascade',
      }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    content: text('content').notNull(),
    parentId: integer('parent_id'),
    createdAt: text('created_at')
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    updatedAt: text('updated_at')
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull()
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => [
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
      name: 'comments_underlying_id_fk',
    }).onDelete('cascade'),
  ]
);

export const userFavoriteLessons = pgTable('user_favorite_lessons', {
  id: serial().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  lessonId: integer('lesson_id')
    .notNull()
    .references(() => lessons.id, { onDelete: 'cascade' }),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const liveLessons = pgTable('live_lessons', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title').notNull(),
  scheduledAt: timestamp('scheduled_at', { withTimezone: true, mode: 'string' }).notNull(),
  duration: integer('duration').notNull(),
  isListed: boolean('is_listed').notNull().default(false),
  isPublished: boolean('is_published').notNull().default(false),
  isCompleted: boolean('is_completed').notNull().default(false),
  description: text('description'),
  meetingLink: text('meeting_link'),
  recordingUrl: text('recording_url'),
  currentParticipants: integer('current_participants').notNull().default(0),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});
