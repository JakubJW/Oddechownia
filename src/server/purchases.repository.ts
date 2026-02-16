import { eq, and } from 'drizzle-orm';
import { db } from './db';
import { purchases } from './db/schema';
import { IPurchasesRepository } from './interfaces/purchases.repository.interface';

export class PurchasesRepository implements IPurchasesRepository {
  async createPurchase(
    userId: string,
    productId: string,
    stripeSessionId?: string
  ): Promise<void> {
    const created = await db
      .insert(purchases)
      .values({ userId, productId, stripeSessionId })
      .onConflictDoNothing();
  }

  async hasUserPurchasedProduct(
    userId: string,
    productId: string
  ): Promise<boolean> {
    const purchase = await db.query.purchases.findFirst({
      columns: { id: true },
      where: and(
        eq(purchases.userId, userId),
        eq(purchases.productId, productId)
      ),
    });

    if (!purchase) return true;
    return false;
  }

  async getUserPurchasedProductIds(userId: string): Promise<string[]> {
    const result = await db.query.purchases.findMany({
      columns: { productId: true },
      where: eq(purchases.userId, userId),
    });

    return result.map((purchase) => purchase.productId);
  }
}
