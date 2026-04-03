import { ILiveLessonsRepository } from '@/application/repositories/live-lessons.repository.interface';
import { LiveLessonInsert } from '@/entities/models/live-lesson';

export class CreateLiveLessonUseCase {
  constructor(private liveLessonsRepository: ILiveLessonsRepository) {}

  async execute(payload: LiveLessonInsert): Promise<void> {
    await this.liveLessonsRepository.create({
      scheduledAt: payload.scheduledAt,
      duration: payload.duration,
      priceId: payload.priceId,
      price: payload.price,
      title: payload.title,
      imageId: payload.imageId,
      subscriberAccess: payload.subscriberAccess,
      meetingLink: payload.meetingLink,
    });
  }
}
