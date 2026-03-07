import { SUBSCRIBER_ACCESS } from './product';
import { PURCHASE_STATE } from './purchase';

export type LiveLesson = {
  id: string;
  title: string;
  description?: string;
  image: string;
  scheduledAt: string;
  price: number;
  subscriberAccess: SUBSCRIBER_ACCESS;
  duration: number;
  isListed: boolean;
  isPublished: boolean;
  isCompleted: boolean;
  meetingLink?: string;
  recordingUrl?: string;
};

export type LiveLessonInsert = {
  scheduledAt: string;
  duration: number;
  isListed: boolean;
  isPublished: boolean;
  isCompleted: boolean;
  meetingLink?: string;
  recordingUrl?: string;
  productId: string;
};

export type LiveLessonProduct = {
  id: string;
  productId: string;
  title: string;
  description?: string;
  price: number;
  image: string;
  scheduledAt: string;
  duration: number;
  state: PURCHASE_STATE;
};

export type UserLiveLessonCard = {
  id: string;
  title: string;
  description?: string;
  image: string;
  scheduledAt: string;
  duration: number;
  meetingLink?: string;
  recordingUrl?: string;
  status: LiveLessonStatus;
};

export enum LiveLessonStatus {
  UPCOMING = 'upcoming',
  LIVE = 'live',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
}
