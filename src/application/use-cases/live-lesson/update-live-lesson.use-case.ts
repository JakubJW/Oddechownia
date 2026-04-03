import { ILiveLessonsRepository } from '@/application/repositories/live-lessons.repository.interface';
import { LiveLessonUpdate } from '@/entities/models/live-lesson';

export class UpdateLiveLessonUseCase {
  constructor(private liveLessonsRepository: ILiveLessonsRepository) {}

  async execute(lessonId: string, payload: LiveLessonUpdate): Promise<void> {
    await this.liveLessonsRepository.update(lessonId, {
      scheduledAt: payload.scheduledAt,
      duration: payload.duration,
      recordingUrl: payload.recordingUrl,
      meetingLink: payload.meetingLink,
      isCompleted: payload.isCompleted,
      isListed: payload.isListed,
      isPublished: payload.isPublished,
      priceId: payload.priceId,
      price: payload.price,
      title: payload.title,
      imageId: payload.imageId,
      subscriberAccess: payload.subscriberAccess,
    });
  }
}
