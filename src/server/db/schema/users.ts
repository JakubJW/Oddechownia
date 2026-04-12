import { pgTable, uuid, boolean, varchar } from 'drizzle-orm/pg-core';
import { UserRoles } from '../consts';
import { relations } from 'drizzle-orm/relations';
import { comments } from './comments';
import { liveLessonsRegistrations } from './live-lessons-registrations';
import { purchases } from './purchases';
import { subscriptions } from './subscriptions';
import { userFavoriteLessons } from './user-favorite-lessons';
import { userLessonProgress } from './user-lessons-progress';
import { userPracticeSchedules } from './user-practice-schedules';

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

export const userRelations = relations(users, ({ many }) => ({
  comments: many(comments),
  favoriteLessons: many(userFavoriteLessons),
  liveLessonsRegistrations: many(liveLessonsRegistrations),
  practiceSchedules: many(userPracticeSchedules),
  lessonProgress: many(userLessonProgress),
  subscriptions: many(subscriptions),
  purchaes: many(purchases),
}));
