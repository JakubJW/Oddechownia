import { relations } from 'drizzle-orm';
import {
  lessons,
  playlists,
  videos,
  users,
  userSubscription,
  playlistLesson,
  attachments,
  comments,
  files,
  userFavoriteLessons,
  liveLessonsRegistrations,
  liveLessons,
  userPracticeSchedules,
} from './schema';

export const playlistRelations = relations(playlists, ({ many, one }) => ({
  playlistLessons: many(playlistLesson),
  video: one(videos, {
    fields: [playlists.videoId],
    references: [videos.id],
  }),
  scheduledPractices: many(userPracticeSchedules),
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
  userFavoriteLessons: many(userFavoriteLessons),
  scheduledPractices: many(userPracticeSchedules),
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

export const userRelations = relations(users, ({ many }) => ({
  subscriptions: many(userSubscription),
  comments: many(comments),
  favoriteLessons: many(userFavoriteLessons),
  liveLessonsRegistrations: many(liveLessonsRegistrations),
  practiceSchedules: many(userPracticeSchedules),
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

export const userFavoriteLessonsRelations = relations(
  userFavoriteLessons,
  ({ one }) => ({
    user: one(users, {
      fields: [userFavoriteLessons.userId],
      references: [users.id],
    }),
    lesson: one(lessons, {
      fields: [userFavoriteLessons.lessonId],
      references: [lessons.id],
    }),
  })
);

export const liveLessonsRelations = relations(liveLessons, ({ many }) => ({
  registrations: many(liveLessonsRegistrations),
}));

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

export const userPracticeSchedulesRelations = relations(
  userPracticeSchedules,
  ({ one }) => ({
    user: one(users, {
      fields: [userPracticeSchedules.userId],
      references: [users.id],
    }),

    lesson: one(lessons, {
      fields: [userPracticeSchedules.lessonId],
      references: [lessons.id],
    }),

    playlist: one(playlists, {
      fields: [userPracticeSchedules.playlistId],
      references: [playlists.id],
    }),
  })
);
