import { LiveLesson } from '@/entities/models/live-lesson';

export interface ILiveLessonsRepository {
  getBySchedule(startDate: string, endDate: string): Promise<LiveLesson[]>;
  getVisibleUpcomingLiveLessons(): Promise<LiveLesson[]>;
  getByProductId(productIds: string[]): Promise<LiveLesson[]>;
}
