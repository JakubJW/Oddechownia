export type LiveLesson = {
  title: string;
  description: string;
  scheduledAt: string;
  duration: number;
  isListed: boolean;
  isPublished: boolean;
  isCompleted: boolean;
  meetingLink?: string;
  recordingUrl?: string;
  thumbnailUrl: string;
};

export type LiveLessonInsert = {
  title: string;
  description: string;
  scheduledAt: string;
  duration: number;
  isListed: boolean;
  isPublished: boolean;
  isCompleted: boolean;
  meetingLink?: string;
  recordingUrl?: string;
  productId: string;
  thumbnailId: number;
};
