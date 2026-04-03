import { LiveLesson, LiveLessonInsert } from '@/entities/models/live-lesson';

export interface ILiveLessonsRepository {
  create(data: LiveLessonInsert): Promise<void>;
  update(lessonId: string, data: LiveLessonInsert): Promise<void>;
  getBySchedule(startDate: string, endDate: string): Promise<LiveLesson[]>;
  getVisibleUpcomingLiveLessons(): Promise<LiveLesson[]>;
  getByProductId(productIds: string[]): Promise<LiveLesson[]>;
  getAll(cursor: string | null): Promise<LiveLesson[]>;
  getById(id: string): Promise<LiveLesson>;
}
