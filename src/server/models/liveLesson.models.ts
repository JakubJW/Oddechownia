import { InferSelectModel } from 'drizzle-orm';
import { liveLessons } from '../db/schema';
import { LiveLessonRegistrationCardDTO } from './liveLessonRegistration.models';
import { AdminLiveLessonCardDTO } from '@/entities/models/live-lesson';

export type LiveLessonSchema = InferSelectModel<typeof liveLessons>;

export type FetchAdminLiveLessonsListResponse = {
  data: AdminLiveLessonCardDTO[];
  nextCursor: string | null;
  error: string | null;
};

export type FetchAdminLiveLessonsParticipantsListResponse = {
  data: LiveLessonRegistrationCardDTO[];
};

export type CreateLiveLessonResponse = {
  message: string;
  success: boolean;
  error: string;
};

export type UpdateLiveLessonResponse = {
  message: string;
  success: boolean;
  error: string;
};

export type LiveLessonSignUpResponse = { url: string };

export type FetchUserLiveLessonsResponse = {
  data: LiveLessonCardUserDashboardDTO[];
  nextCursor: string | null;
  success: boolean;
  error: string | null;
};

export type LiveLessonCardDTO = {
  id: string;
  title: string;
  scheduledAt: string;
  duration: number;
  isListed: boolean;
  description?: string;
  isRegistered: boolean;
  isPaymentPending: boolean;
  thumbnail?: string;
} & Eligibility;

export type Eligibility =
  | {
      isEligibleForFree: false;
      freeEligibilitiesUsed: number | null;
    }
  | {
      isEligibleForFree: true;
      freeEligibilitiesUsed: number;
    };

export type LiveLessonCardUserDashboardDTO = {
  id: string;
  title: string;
  description?: string;
  scheduledAt: string;
  thumbnail?: string;
  duration: number;
  status: 'upcoming' | 'live' | 'completed';
  meetingUrl?: string;
  recordingUrl?: string;
};
