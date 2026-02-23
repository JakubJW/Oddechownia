import { eq } from 'drizzle-orm';
import { db } from '@/server/db';
import { ebooks } from '@/server/db/schema';
import { IEbooksRepository } from '@/application/repositories/ebooks.repository.interface';

export class EbooksRepository implements IEbooksRepository {
  async getEbookByProductId(productId: string) {
    const result = await db.query.ebooks.findFirst({
      columns: { path: true },
      where: eq(ebooks.productId, productId),
    });

    return result;
  }
}
