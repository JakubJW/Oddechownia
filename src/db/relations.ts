import { relations } from 'drizzle-orm';
import {
  lessons,
  playlists,
  courses,
  videos,
  users,
  userSubscription,
  stripeProducts,
  stripePrices,
  userOneOffPurchase,
} from './schema';

export const lessonsRelations = relations(lessons, ({ one }) => ({
  playlist: one(playlists, {
    fields: [lessons.playlistId],
    references: [playlists.id],
  }),
  video: one(videos, {
    fields: [lessons.id],
    references: [videos.lessonId],
  }),
}));

export const videosRelations = relations(videos, ({ one }) => ({
  lesson: one(lessons, {
    fields: [videos.lessonId],
    references: [lessons.id],
  }),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  lessons: many(lessons),
  userOneOffPurchases: many(userOneOffPurchase),
}));

export const userRelations = relations(users, ({ many }) => ({
  subscriptions: many(userSubscription),
  purchases: many(userOneOffPurchase),
}));

export const stripeProductsRelations = relations(
  stripeProducts,
  ({ many }) => ({
    stripePrices: many(stripePrices),
  })
);

export const stripePricesRelations = relations(stripePrices, ({ one }) => ({
  stripeProduct: one(stripeProducts, {
    fields: [stripePrices.stripeProductId],
    references: [stripeProducts.stripeProductId],
  }),
}));

export const userSubscriptionRelations = relations(
  userSubscription,
  ({ one }) => ({
    user: one(users, {
      fields: [userSubscription.userId],
      references: [users.id],
    }),
  })
);

export const userOneOffPurchasesRelations = relations(
  userOneOffPurchase,
  ({ one }) => ({
    user: one(users, {
      fields: [userOneOffPurchase.userId],
      references: [users.id],
    }),
    course: one(courses, {
      fields: [userOneOffPurchase.courseId],
      references: [courses.id],
    }),
  })
);
