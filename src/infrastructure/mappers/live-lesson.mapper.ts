// infrastructure/mappers/live-lesson.mapper.ts
import { LiveLesson } from '@/entities/models/live-lesson';
import { SUBSCRIBER_ACCESS } from '@/entities/models/product';
import { files, liveLessons, products, purchases } from '@/server/db/schema';
import { supabaseService } from '@/server/services/supabase.service';
import { InferSelectModel } from 'drizzle-orm';

type LiveLessonRaw = InferSelectModel<typeof liveLessons> & {
  product:
    | (InferSelectModel<typeof products> & {
        purchases?: InferSelectModel<typeof purchases>[];
        image: InferSelectModel<typeof files> | null;
      })
    | null;
};

export class LiveLessonMapper {
  static toDomain(raw: LiveLessonRaw): LiveLesson {
    return {
      id: raw.id,
      productId: raw.productId!,
      title: raw.product?.name || raw.title,
      description: raw.product?.description || undefined,
      image: raw.product?.image
        ? supabaseService.getThumbnailUrl(
            raw.product?.image?.bucket,
            raw.product?.image?.path
          ).data
        : '',
      price: raw.product?.price || 0,
      scheduledAt: raw.scheduledAt,
      duration: raw.duration,
      isListed: raw.isListed,
      isPublished: raw.isPublished,
      isCompleted: raw.isCompleted,
      meetingLink: raw.meetingLink || undefined,
      recordingUrl: raw.recordingUrl || undefined,
      subscriberAccess: raw.product?.subscriberAccess as SUBSCRIBER_ACCESS,
      priceId: raw.product?.priceId || '',
      currentParticipants: raw.product?.purchases?.length || 0,
    };
  }
}
