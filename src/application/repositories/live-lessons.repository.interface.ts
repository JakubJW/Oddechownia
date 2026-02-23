import { LiveLessonInsert, LiveLesson } from '@/entities/models/live-lesson';

export interface ILiveLessonsRepository {
  // create(payload: LiveLessonInsert): Promise<LiveLesson>;
  // update(payload: Partial<LiveLessonInsert>): Promise<LiveLesson>;
  // delete(lessonId: string): Promise<void>;
  // getAll(): Promise<LiveLesson[]>;
  getBySchedule(startDate: string, endDate: string): Promise<LiveLesson[]>;
  // getVisibleUpcomingLiveLessons(): Promise<LiveLesson[]>;
}
