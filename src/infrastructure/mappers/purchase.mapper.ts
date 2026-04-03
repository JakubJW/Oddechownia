// infrastructure/mappers/live-lesson.mapper.ts
import { ACQUISITION_METHOD, Purchase } from '@/entities/models/purchase';
import { purchases } from '@/server/db/schema';
import { InferSelectModel } from 'drizzle-orm';

type PurchaseRaw = InferSelectModel<typeof purchases>;

export class PurchaseMapper {
  static toDomain(raw: PurchaseRaw): Purchase {
    return {
      id: raw.id,
      userId: raw.userId ?? undefined,
      email: raw.email,
      acquisitionMethod: raw.acquisitionMethod as unknown as ACQUISITION_METHOD,
      checkoutSessionId: raw.checkoutSessionId ?? undefined,
      productId: raw.productId,
      createdAt: raw.createdAt,
    };
  }
}
