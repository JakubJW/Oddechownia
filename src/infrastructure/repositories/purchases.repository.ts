import { eq, and, lte, gte } from 'drizzle-orm';
import { db } from '@/server/db';
import { purchases } from '@/server/db/schema';
import { IPurchasesRepository } from '@/application/repositories/purchases.repository.interface';
import {
  ACQUISITION_METHOD,
  Purchase,
  PurchaseInsert,
} from '@/entities/models/purchase';

export class PurchasesRepository implements IPurchasesRepository {
  async create(payload: PurchaseInsert): Promise<Purchase> {
    const [created] = await db
      .insert(purchases)
      .values(payload)
      .onConflictDoNothing()
      .returning();

    return {
      id: created.id,
      productId: created.productId,
      checkoutSessionId: created.checkoutSessionId || undefined,
      email: created.email,
      userId: created.userId || undefined,
      acquisitionMethod: created.acquisitionMethod as ACQUISITION_METHOD,
    };
  }

  async hasUserPurchasedProduct(
    productId: string,
    userId?: string
  ): Promise<boolean> {
    if (!userId) return false;

    const purchase = await db.query.purchases.findFirst({
      columns: { id: true },
      where: and(
        eq(purchases.userId, userId),
        eq(purchases.productId, productId)
      ),
    });

    return purchase ? true : false;
  }

  async getUserPurchasedProductIds(userId: string): Promise<string[]> {
    const result = await db.query.purchases.findMany({
      columns: { productId: true },
      where: eq(purchases.userId, userId),
    });

    return result.map((purchase) => purchase.productId);
  }

  async findBySessionId(sessionId: string): Promise<Purchase | undefined> {
    const purchase = await db.query.purchases.findFirst({
      where: eq(purchases.checkoutSessionId, sessionId),
    });

    if (!purchase) return undefined;

    return {
      id: purchase.id,
      productId: purchase.productId,
      checkoutSessionId: purchase.checkoutSessionId || undefined,
      email: purchase.email,
      userId: purchase.userId || undefined,
      acquisitionMethod: purchase.acquisitionMethod as ACQUISITION_METHOD,
    };
  }

  async getUserFreeQuotaUsage(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<number> {
    const result = await db.query.purchases.findMany({
      columns: { id: true },
      where: and(
        eq(purchases.userId, userId),
        eq(purchases.acquisitionMethod, ACQUISITION_METHOD.SUBSCRIPTION_QUOTA),
        gte(purchases.createdAt, startDate),
        lte(purchases.createdAt, endDate)
      ),
    });

    return result.length;
  }
}
