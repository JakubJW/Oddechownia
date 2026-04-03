import { SUBSCRIBER_ACCESS } from './product';
import { PURCHASE_STATE } from './purchase';

export type LiveLesson = {
  id: string;
  title: string;
  description?: string;
  image: string;
  scheduledAt: string;
  duration: number;
  isListed: boolean;
  isPublished: boolean;
  isCompleted: boolean;
  meetingLink?: string;
  recordingUrl?: string;
  price: number;
  productId: string;
  subscriberAccess: SUBSCRIBER_ACCESS;
  priceId: string;
  currentParticipants: number;
};

export type LiveLessonInsert = {
  title: string;
  description?: string;
  imageId: number;
  scheduledAt: string;
  duration: number;
  priceId: string;
  price: number;
  subscriberAccess: SUBSCRIBER_ACCESS;
  meetingLink?: string;
  recordingUrl?: string;
  isListed?: boolean;
  isCompleted?: boolean;
  isPublished?: boolean;
};

export type LiveLessonUpdate = LiveLessonInsert & {
  isListed: boolean;
  isCompleted: boolean;
  isPublished: boolean;
  recordingUrl?: string;
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

export type AdminLiveLessonCardDTO = {
  id: string;
  title: string;
  description?: string;
  image: string;
  scheduledAt: string;
  duration: number;
  meetingLink?: string;
  recordingUrl?: string;
  isListed: boolean;
  isPublished: boolean;
  isCompleted: boolean;
  currentParticipants: number;
  isFree: boolean;
  priceId: string;
  price: number;
  subscriberAccess: SUBSCRIBER_ACCESS;
};

export enum LiveLessonStatus {
  UPCOMING = 'upcoming',
  LIVE = 'live',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
}
