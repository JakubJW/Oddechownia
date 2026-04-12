import { ILiveLessonsRepository } from '@/application/repositories/live-lessons.repository.interface';
import { IPurchasesRepository } from '@/application/repositories/purchases.repository.interface';
import { ISubscriptionRepository } from '@/application/repositories/subscription.repository.interface';
import { LiveLesson, UserLiveLessonCard } from '@/entities/models/live-lesson';
import { isBefore } from 'date-fns';
import { LiveLessonStatus } from '@/entities/models/live-lesson';

export class GetUserLiveLessons {
  constructor(
    private purchasesRepository: IPurchasesRepository,
    private subscriptionRepository: ISubscriptionRepository,
    private liveLessonsRepository: ILiveLessonsRepository
  ) {}

  async execute(userId: string): Promise<UserLiveLessonCard[]> {
    const purchased =
      await this.purchasesRepository.getUserPurchasedProductIds(userId);

    const lessons = await this.liveLessonsRepository.getByProductId(purchased);

    return lessons
      .map((item) => this.mapToDTO(item))
      .sort(
        (a, b) =>
          new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
      );
  }

  private mapToDTO(item: LiveLesson): UserLiveLessonCard {
    return {
      id: item.id,
      title: item.title,
      image: item.image,
      description: item.description,
      scheduledAt: item.scheduledAt,
      duration: item.duration,
      meetingLink: item.meetingLink,
      recordingUrl: item.recordingUrl,
      status: this.getLiveLessonStatus(item),
    };
  }

  private getLiveLessonStatus(lesson: LiveLesson) {
    const now = new Date();
    const start = new Date(lesson.scheduledAt);

    if (lesson.recordingUrl) {
      return LiveLessonStatus.COMPLETED;
    }

    if (lesson.isCompleted) {
      return LiveLessonStatus.PROCESSING;
    }

    if (isBefore(now, start)) {
      return LiveLessonStatus.UPCOMING;
    }

    return LiveLessonStatus.LIVE;
  }
}
