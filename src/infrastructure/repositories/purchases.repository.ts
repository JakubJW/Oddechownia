import { eq, and, lte, gte } from 'drizzle-orm';
import { db } from '@/server/db';
import { purchases } from '@/server/db/schema';
import { IPurchasesRepository } from '@/application/repositories/purchases.repository.interface';
import {
  ACQUISITION_METHOD,
  Purchase,
  PurchaseInsert,
} from '@/entities/models/purchase';
import { PurchaseMapper } from '../mappers/purchase.mapper';

export class PurchasesRepository implements IPurchasesRepository {
  async create(payload: PurchaseInsert): Promise<Purchase> {
    const [result] = await db
      .insert(purchases)
      .values(payload)
      .onConflictDoNothing()
      .returning();

    return PurchaseMapper.toDomain(result);
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

  async hasUserEmailPurchasedProduct(
    productId: string,
    email: string
  ): Promise<boolean> {
    const purchase = await db.query.purchases.findFirst({
      columns: { id: true },
      where: and(
        eq(purchases.email, email),
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
    const result = await db.query.purchases.findFirst({
      where: eq(purchases.checkoutSessionId, sessionId),
      with: {
        product: {
          columns: {
            type: true,
          },
        },
      },
    });

    if (!result) return undefined;

    return PurchaseMapper.toDomain(result);
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

  async findByProductId(id: string): Promise<Purchase[]> {
    const result = await db.query.purchases.findMany({
      where: eq(purchases.productId, id),
      with: {
        product: {
          columns: {
            type: true,
          },
        },
      },
    });

    return result.map(PurchaseMapper.toDomain);
  }

  async findById(id: string): Promise<Purchase | undefined> {
    const result = await db.query.purchases.findFirst({
      where: eq(purchases.id, id),
      with: {
        product: {
          columns: {
            type: true,
          },
        },
      },
    });

    if (!result) return undefined;

    return PurchaseMapper.toDomain(result);
  }
}
