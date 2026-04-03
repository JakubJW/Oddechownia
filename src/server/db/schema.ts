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
  uniqueIndex,
  check,
  jsonb,
} from 'drizzle-orm/pg-core';
import { UserRoles } from './consts';
import { sql } from 'drizzle-orm';

export const blogPosts = pgTable('blog_posts', {
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
    .references(() => files.id, { onDelete: 'restrict' }),
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
  assetId: varchar('asset_id'),
});

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  role: varchar('role').default(UserRoles.USER),
  firstName: varchar('first_name').notNull(),
  lastName: varchar('last_name').notNull(),
  email: varchar('email').notNull(),
  regulationsAgreement: boolean('regulations_agreement').default(false),
  privacyPolicyAgreement: boolean('privacy_policy_agreement').default(false),
  stripeCustomerId: varchar('stripe_customer_id'),
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
  isAccessibleForFree: boolean('is_accessible_for_free')
    .notNull()
    .default(false),
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
  uploadStatus: varchar('upload_status'),
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
    lessonId: integer('lesson_id').references(() => lessons.id, {
      onDelete: 'cascade',
    }),
    postId: integer('post_id').references(() => posts.id, {
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
    check(
      'comment_parent_check',
      sql`
        (${table.lessonId} IS NOT NULL AND ${table.postId} IS NULL) OR 
        (${table.lessonId} IS NULL AND ${table.postId} IS NOT NULL)
      `
    ),
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
  scheduledAt: timestamp('scheduled_at', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
  duration: integer('duration').notNull(),
  isListed: boolean('is_listed').notNull().default(false),
  isPublished: boolean('is_published').notNull().default(false),
  isCompleted: boolean('is_completed').notNull().default(false),
  description: text('description'),
  meetingLink: text('meeting_link'),
  recordingUrl: text('recording_url'),
  thumbnailId: integer('thumbnail_id').references(() => files.id, {
    onDelete: 'set null',
  }),
  productId: uuid('product_id')
    .references(() => products.id)
    .unique(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const liveLessonsRegistrations = pgTable('live_lessons_registrations', {
  id: uuid('id').defaultRandom().primaryKey(),
  lessonId: uuid().references(() => liveLessons.id, { onDelete: 'cascade' }),
  name: varchar('name').notNull(),
  email: varchar('email').notNull(),
  userId: uuid('userId').references(() => users.id, { onDelete: 'cascade' }),
  checkoutSessionId: text('checkout_session_id'),
  accessMethod: varchar('access_method')
    .$type<'paid_one_time' | 'subscription_entitlement'>()
    .notNull(),
  paymentStatus: varchar('payment_status').$type<
    'unpaid' | 'paid' | 'failed' | null
  >(),
  stripePriceId: text('stripe_price_id'),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const userPracticeSchedules = pgTable('user_practice_schedules', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  lessonId: integer('lesson_id')
    .notNull()
    .references(() => lessons.id),
  playlistId: integer('playlist_id')
    .notNull()
    .references(() => playlists.id),
  scheduledAt: timestamp('scheduled_at', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const userLessonProgress = pgTable(
  'user_lesson_progress',
  {
    id: serial('id').primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    lessonId: integer('lesson_id')
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    playlistId: integer('playlist_id').references(() => playlists.id, {
      onDelete: 'set null',
    }),
    isCompleted: boolean('is_completed').default(false).notNull(),
    lastPositionSeconds: integer('last_position_seconds').default(0).notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique('unique_user_lesson_constratint').on(table.userId, table.lessonId),
  ]
);

export const subscriptions = pgTable(
  'subscriptions',
  {
    id: serial('id').primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    stripeSubscriptionId: varchar('stripe_subscription_id').notNull().unique(),
    status: varchar('status').notNull(),
    currentPeriodStart: timestamp('current_period_start', {
      mode: 'string',
    }).notNull(),
    currentPeriodEnd: timestamp('current_period_end', {
      mode: 'string',
    }).notNull(),
    cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false).notNull(),
    createdAt: text('created_at')
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    updatedAt: text('updated_at')
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull()
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  },
  (t) => [uniqueIndex('subscription_user_idx').on(t.userId)]
);

export const labels = pgTable('labels', {
  id: serial('id').primaryKey(),
  text: varchar('text', { length: 50 }).notNull().unique(),
  color: varchar('color', { length: 20 }).notNull(),
});

export const lessonLabels = pgTable(
  'lesson_labels',
  {
    id: serial('id').primaryKey(),
    lessonId: integer('lesson_id')
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    labelId: integer('label_id')
      .notNull()
      .references(() => labels.id, { onDelete: 'cascade' }),
  },
  (t) => [unique('unique_label_lesson_constraint').on(t.labelId, t.lessonId)]
);

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  authorId: uuid('author_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  slug: text('slug').notNull().unique(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const contentBlocks = pgTable('content_blocks', {
  id: serial('id').primaryKey(),
  pageSlug: text('page_slug').notNull().default('/'),
  type: text('type').notNull(),
  content: jsonb('content').notNull(),
  orderIndex: integer('order_index').notNull().default(0),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name').notNull(),
  slug: varchar('slug').notNull(),
  type: varchar('type').$type<'ebook' | 'live-lesson'>().notNull(),
  description: text('description'),
  priceId: text('price_id').notNull(),
  imageId: integer('image_id').references(() => files.id),
  price: integer('price').notNull(),
  isVisible: boolean('is_visible').default(true),
  subscriberAccess: varchar('subscriber_access')
    .$type<'paid' | 'free_unlimited' | 'quota_based'>()
    .notNull()
    .default('paid'),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const ebooks = pgTable('ebooks', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id')
    .references(() => products.id)
    .notNull()
    .unique(),
  path: text('path').notNull(),
});

export const purchases = pgTable(
  'purchases',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    email: varchar('email').notNull(),
    productId: uuid('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    checkoutSessionId: text('checkout_session_id'),
    acquisitionMethod: text('acquisition_method')
      .$type<
        | 'payment'
        | 'subscription_quota'
        | 'subscription_benefit'
        | 'free_public'
      >()
      .notNull(),
    createdAt: text('created_at')
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  },
  (t) => [unique('unique_user_product').on(t.userId, t.productId)]
);
