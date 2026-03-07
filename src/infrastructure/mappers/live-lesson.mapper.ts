// infrastructure/mappers/live-lesson.mapper.ts
import { LiveLesson } from '@/entities/models/live-lesson';
import { SUBSCRIBER_ACCESS } from '@/entities/models/product';
import { liveLessons, products } from '@/server/db/schema';
import { InferSelectModel } from 'drizzle-orm';

type LiveLessonWithProduct = InferSelectModel<typeof liveLessons> & {
  product: InferSelectModel<typeof products> | null;
};

export class LiveLessonMapper {
  static toDomain(raw: LiveLessonWithProduct): LiveLesson {
    return {
      id: raw.productId!,
      title: raw.product?.name || raw.title,
      description: raw.product?.description || undefined,
      image: raw.product!.image!,
      price: raw.product!.price,
      scheduledAt: raw.scheduledAt,
      duration: raw.duration,
      isListed: raw.isListed,
      isPublished: raw.isPublished,
      isCompleted: raw.isCompleted,
      meetingLink: raw.meetingLink || undefined,
      recordingUrl: raw.recordingUrl || undefined,
      subscriberAccess: raw.product!.subscriberAccess as SUBSCRIBER_ACCESS,
    };
  }
}
