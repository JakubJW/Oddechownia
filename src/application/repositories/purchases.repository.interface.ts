import { Purchase, PurchaseInsert } from '@/entities/models/purchase';

export interface IPurchasesRepository {
  create(payload: PurchaseInsert): Promise<Purchase>;
  findBySessionId(sessionId: string): Promise<Purchase | undefined>;
  hasUserPurchasedProduct(productId: string, userId?: string): Promise<boolean>;
  getUserPurchasedProductIds(userId: string): Promise<string[]>;
  getUserFreeQuotaUsage(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<number>;
}
