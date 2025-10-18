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
  playlistLesson,
  attachments,
  comments,
  files,
} from './schema';

export const playlistRelations = relations(playlists, ({ many, one }) => ({
  playlistLessons: many(playlistLesson),
  video: one(videos, {
    fields: [playlists.videoId],
    references: [videos.id],
  }),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  playlistLessons: many(playlistLesson),
  video: one(videos, {
    fields: [lessons.videoId],
    references: [videos.id],
  }),
  attachments: many(attachments),
  comments: many(comments),
  thumbnail: one(files, {
    fields: [lessons.thumbnailId],
    references: [files.id],
  }),
}));

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

export const coursesRelations = relations(courses, ({ many }) => ({
  lessons: many(lessons),
  userOneOffPurchases: many(userOneOffPurchase),
}));

export const userRelations = relations(users, ({ many }) => ({
  subscriptions: many(userSubscription),
  purchases: many(userOneOffPurchase),
  comments: many(comments),
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

export const playlistLessonRelations = relations(playlistLesson, ({ one }) => ({
  lesson: one(lessons, {
    fields: [playlistLesson.lessonId],
    references: [lessons.id],
  }),
  playlist: one(playlists, {
    fields: [playlistLesson.playlistId],
    references: [playlists.id],
  }),
}));

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  lesson: one(lessons, {
    fields: [attachments.lessonId],
    references: [lessons.id],
  }),
  file: one(files, {
    fields: [attachments.fileId],
    references: [files.id],
  }),
}));

export const filesRelations = relations(files, ({ one }) => ({
  attachment: one(attachments, {
    fields: [files.id],
    references: [attachments.fileId],
  }),
  lesson: one(lessons, {
    fields: [files.id],
    references: [lessons.thumbnailId],
  }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [comments.lessonId],
    references: [lessons.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: 'commentReplies',
  }),
  replies: many(comments, {
    relationName: 'commentReplies',
  }),
}));
