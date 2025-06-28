import { relations } from 'drizzle-orm';
import {
  lessons,
  courses,
  videos,
  profiles,
  coursesToProfiles,
  stripeProducts,
  stripePrices,
} from './schema';

export const lessonsRelations = relations(lessons, ({ one }) => ({
  course: one(courses, {
    fields: [lessons.courseId],
    references: [courses.id],
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
  profiles: many(coursesToProfiles),
}));

export const profilesRelations = relations(profiles, ({ many }) => ({
  courses: many(coursesToProfiles),
}));

export const coursesToProfilesRelations = relations(
  coursesToProfiles,
  ({ one }) => ({
    profile: one(profiles, {
      fields: [coursesToProfiles.profileId],
      references: [profiles.id],
    }),
    course: one(courses, {
      fields: [coursesToProfiles.courseId],
      references: [courses.id],
    }),
  })
);

// export const stripeProductsRelations = relations(stripeProducts, ({ one }) => ({
//   stripePrice: one(stripePrices, {
//     fields: [stripeProducts.stripeProductId],
//     references: [stripePrices.stripeProductId],
//   }),
// }));

export const stripeProductsRelations = relations(stripeProducts, ({ many }) => ({
  stripePrices: many(stripePrices),
}));

// export const stripePricesRelations = relations(stripePrices, ({ many }) => ({
//   stripeProducts: many(stripeProducts),
// }));

export const stripePricesRelations = relations(stripePrices, ({ one }) => ({
  stripeProduct: one(stripeProducts, {
    fields: [stripePrices.stripeProductId],
    references: [stripeProducts.stripeProductId]
  }),
}));
