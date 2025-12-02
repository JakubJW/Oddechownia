import { relations } from 'drizzle-orm';
import {
  lessons,
  playlists,
  videos,
  users,
  playlistLesson,
  attachments,
  comments,
  files,
  userFavoriteLessons,
  liveLessonsRegistrations,
  liveLessons,
  userPracticeSchedules,
  userLessonProgress,
  subscriptions,
  labels,
  lessonLabels,
} from './schema';

export const playlistRelations = relations(playlists, ({ many, one }) => ({
  playlistLessons: many(playlistLesson),
  video: one(videos, {
    fields: [playlists.videoId],
    references: [videos.id],
  }),
  scheduledPractices: many(userPracticeSchedules),
  progressRecords: many(userLessonProgress),
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
  progressRecords: many(userLessonProgress),
  labels: many(lessonLabels),
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

export const userRelations = relations(users, ({ many, one }) => ({
  comments: many(comments),
  favoriteLessons: many(userFavoriteLessons),
  liveLessonsRegistrations: many(liveLessonsRegistrations),
  practiceSchedules: many(userPracticeSchedules),
  lessonProgress: many(userLessonProgress),
  subscription: one(subscriptions, {
    fields: [users.id],
    references: [subscriptions.userId],
  }),
}));

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

export const userLessonProgressRelations = relations(
  userLessonProgress,
  ({ one }) => ({
    user: one(users, {
      fields: [userLessonProgress.userId],
      references: [users.id],
    }),
    lesson: one(lessons, {
      fields: [userLessonProgress.lessonId],
      references: [lessons.id],
    }),
    playlist: one(playlists, {
      fields: [userLessonProgress.playlistId],
      references: [playlists.id],
    }),
  })
);

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));

export const labelsRelations = relations(labels, ({ many }) => ({
  lessons: many(lessonLabels),
}));

export const lessonLabelsRelations = relations(lessonLabels, ({ one }) => ({
  lesson: one(lessons, {
    fields: [lessonLabels.lessonId],
    references: [lessons.id],
  }),
  label: one(labels, {
    fields: [lessonLabels.labelId],
    references: [labels.id],
  }),
}));
