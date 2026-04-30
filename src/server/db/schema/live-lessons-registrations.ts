import { relations, sql } from 'drizzle-orm';
import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { liveLessons } from './live-lessons';
import { users } from './users';

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

export const liveLessonsRegistrationsRelations = relations(
  liveLessonsRegistrations,
  ({ one }) => ({
    user: one(users, {
      fields: [liveLessonsRegistrations.userId],
      references: [users.id],
    }),
    lesson: one(liveLessons, {
      fields: [liveLessonsRegistrations.lessonId],
      references: [liveLessons.id],
    }),
  })
);
