import { eq, and } from 'drizzle-orm';
import { db } from '@/server/db';
import { purchases } from '@/server/db/schema';
import { IPurchasesRepository } from '@/application/repositories/purchases.repository.interface';
import { Purchase, PurchaseInsert } from '@/entities/models/purchase';

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
      acquisitionMethod: created.acquisitionMethod,
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

    if (purchase) return true;
    return false;
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
      acquisitionMethod: purchase.acquisitionMethod,
    };
  }
}
