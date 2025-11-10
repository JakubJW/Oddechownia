import { InferSelectModel } from 'drizzle-orm';
import { liveLessons } from '../db/schema';

export type LiveLessonSchema = InferSelectModel<typeof liveLessons>;

export type AdminLiveLessonRecordDTO = {
  id: string;
  title: string;
  scheduledAt: string;
  duration: number;
  isListed: boolean;
  isPublished: boolean;
  isCompleted: boolean;
  description?: string;
  meetingLink?: string;
  recordingUrl?: string;
  currentParticipants: number;
};

export type FetchAdminLiveLessonsListResponse = {
  data: AdminLiveLessonRecordDTO[];
  nextCursor: string | null;
  success: boolean;
  error: string | null;
};
