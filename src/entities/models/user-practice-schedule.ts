export type UserPracticeSchedule = {
  id: string;
  lessonId: number;
  playlistId: number;
  userId?: string;
  scheduledAt: string;
};

export type UserPracticeScheduleEvent = {
  id: string;
  lesson: {
    id: number;
    title: string;
    thumbnailUrl: string;
    url: string;
    duration: number;
  };
  scheduledAt: string;
};

export type UserPracticeScheduleInsert = Omit<UserPracticeSchedule, 'id'>;

export type CalendarEventType = 'live-lesson' | 'practice-session';
export type LiveLessonStatus = 'upcoming' | 'live' | 'completed';
export type LiveLessonRecordingStatus = 'available' | 'preparing';

interface BaseEvent {
  id: string;
  date: string;
  title: string;
  type: CalendarEventType;
  duration: number;
}

export interface LiveLessonEvent extends BaseEvent {
  type: 'live-lesson';
  status: LiveLessonStatus;
  meetingLink?: string;
  recordingStatus?: LiveLessonRecordingStatus;
  recordingUrl?: string;
  isPaymentPending: boolean;
  isRegistered: boolean;
  isEligibleForFree: boolean;
  freeEligibilitiesUsed: number;
  description?: string;
}

export interface PracticeSessionEvent extends BaseEvent {
  type: 'practice-session';
  lessonUrl: string;
}

export type CalendarEvent = LiveLessonEvent | PracticeSessionEvent;
