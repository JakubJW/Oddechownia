import Stripe from 'stripe';

import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  uuid,
  jsonb,
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

export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  description: varchar('description', { length: 256 }).notNull(),
  slug: varchar('slug', { length: 256 }).notNull(),
  isPublished: boolean('is_published').notNull(),
  isOneOff: boolean('is_one_off').default(false).notNull(),
  priceInCents: integer('price_in_cents'),
  stripePriceId: varchar('stripe_price_id'),
});

export const lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  description: varchar('description').notNull(),
  slug: varchar('slug').notNull(),
  videoId: integer('video_id').references(() => videos.id, {
    onDelete: 'set null',
  }),
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
});

export const stripeProducts = pgTable('stripe_products', {
  stripeProductId: varchar('stripe_product_id').primaryKey(),
  name: varchar('name').notNull(),
  description: varchar('description'),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  marketingFeatures: jsonb('marketing_features')
    .$type<Stripe.Product.MarketingFeature[]>()
    .notNull(),
});

export const stripePrices = pgTable('stripe_prices', {
  stripePriceId: varchar('stripe_price_id').primaryKey(),
  stripeProductId: varchar('stripe_product_id')
    .notNull()
    .references(() => stripeProducts.stripeProductId, { onDelete: 'cascade' }),
  active: boolean('active').default(true).notNull(),
  unitAmount: integer('unit_amount').notNull(),
  currency: varchar('currency').notNull(),
  type: varchar('type').notNull(),
  interval: varchar('interval'),
  intervalCount: integer('interval_count'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
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

export const userOneOffPurchase = pgTable('user_one_off_purchase', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  courseId: integer('course_id').references(() => courses.id, {
    onDelete: 'cascade',
  }),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
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
  name: varchar('name').notNull(),
  internalName: varchar('internal_name').notNull(),
  url: text('url').notNull(),
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
