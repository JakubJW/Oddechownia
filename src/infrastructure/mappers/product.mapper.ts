// infrastructure/mappers/live-lesson.mapper.ts
import {
  Product,
  PRODUCT_TYPE,
  SUBSCRIBER_ACCESS,
} from '@/entities/models/product';
import { files, products } from '@/server/db/schema';
import { supabaseService } from '@/server/services/supabase.service';
import { InferSelectModel } from 'drizzle-orm';

type ProductRaw = InferSelectModel<typeof products> & {
  image: InferSelectModel<typeof files> | null;
};

export class ProductMapper {
  static toDomain(raw: ProductRaw): Product {
    return {
      id: raw.id,
      name: raw.name,
      slug: raw.slug,
      description: raw.description ?? undefined,
      image: raw.image
        ? supabaseService.getThumbnailUrl(raw.image.bucket, raw.image.path).data
        : '',
      price: raw.price,
      priceId: raw.priceId,
      subscriberAccess: raw.subscriberAccess as SUBSCRIBER_ACCESS,
      type: raw.type as PRODUCT_TYPE,
      isVisible: raw.isVisible ?? false,
    };
  }
}
