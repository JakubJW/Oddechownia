import { ILiveLessonsRepository } from '@/application/repositories/live-lessons.repository.interface';
import {
  AdminLiveLessonCardDTO,
  LiveLesson,
} from '@/entities/models/live-lesson';

export class GetAdminLiveLessonsList {
  constructor(private liveLessonsRepository: ILiveLessonsRepository) {}

  async execute(cursor: string | null): Promise<AdminLiveLessonCardDTO[]> {
    const lessons = await this.liveLessonsRepository.getAll(cursor);

    return lessons.map(this.mapToDTO);
  }

  private mapToDTO(item: LiveLesson): AdminLiveLessonCardDTO {
    return {
      id: item.id,
      title: item.title,
      image: item.image,
      description: item.description,
      scheduledAt: item.scheduledAt,
      duration: item.duration,
      meetingLink: item.meetingLink,
      recordingUrl: item.recordingUrl,
      currentParticipants: item.currentParticipants,
      isListed: item.isListed,
      isPublished: item.isPublished,
      isCompleted: item.isCompleted,
      isFree: item.price === 0,
      priceId: item.priceId,
      price: item.price,
      subscriberAccess: item.subscriberAccess,
    };
  }
}
