import { IProductsRepository } from '@/application/repositories/products.repository.interface';
import { Product, PRODUCT_TYPE } from '@/entities/models/product';
import { db } from '@/server/db';
import { products } from '@/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { ProductMapper } from '../mappers/product.mapper';

export class ProductsRepository implements IProductsRepository {
  async getBySlug(slug: string): Promise<Product | undefined> {
    const result = await db.query.products.findFirst({
      where: eq(products.slug, slug),
      with: {
        image: true,
      },
    });

    if (!result) return undefined;

    return ProductMapper.toDomain(result);
  }

  async getById(id: string): Promise<Product | undefined> {
    const result = await db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        image: true,
      },
    });

    if (!result) return undefined;

    return ProductMapper.toDomain(result);
  }

  async getVisibleProductsByType(type: PRODUCT_TYPE): Promise<Product[]> {
    const result = await db.query.products.findMany({
      where: and(eq(products.isVisible, true), eq(products.type, type)),
      with: {
        image: true,
      },
    });

    return result.map(ProductMapper.toDomain);
  }
}
