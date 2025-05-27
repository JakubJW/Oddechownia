import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  uuid,
  primaryKey,
  jsonb,
} from 'drizzle-orm/pg-core';
import { UserRoles } from './consts';

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
  name: varchar('name', { length: 256 }).notNull(),
  description: varchar('description', { length: 256 }).notNull(),
  slug: varchar('slug', { length: 256 }).notNull(),
  courseId: integer('course_id')
    .references(() => courses.id, { onDelete: 'cascade' })
    .notNull(),
  position: integer('position').notNull(),
});

export const videos = pgTable('videos', {
  id: serial('id').primaryKey(),
  lessonId: integer('lesson_id')
    .unique()
    .references(() => lessons.id, {
      onDelete: 'cascade',
    }),
  uploadId: varchar('upload_id').unique().notNull(),
  publicPlaybackId: varchar('public_playback_id'),
  privatePlaybackId: varchar('private_playback_id'),
  duration: integer('duration'),
  aspectRatio: varchar('aspect_ratio'),
  status: varchar().default('preparing').notNull(),
});

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().notNull(),
  role: text('role').notNull().default(UserRoles.USER),
  firstName: text('first_name'),
  lastName: text('last_name'),
  regulationsAgreement: boolean('regulations_agreement').default(false),
  privacyPolicyAgreement: boolean('privacy_policy_agreement').default(false),
});

export const coursesToProfiles = pgTable(
  'courses_to_profiles',
  {
    profileId: uuid('profile_id')
      .references(() => profiles.id)
      .notNull(),
    courseId: integer('course_id')
      .references(() => courses.id)
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.profileId, t.courseId] })]
);

export const stripeProducts = pgTable('stripe_products', {
  stripeProductId: varchar('stripe_product_id').primaryKey().notNull(),
  name: varchar('name').notNull(),
  description: varchar('description'),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  marketingFeatures: jsonb('marketing_features').notNull(),
});

export const stripePrices = pgTable('stripe_prices', {
  stripePriceId: varchar('stripe_price_id').primaryKey().notNull(),
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
