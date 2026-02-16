import { and, eq } from 'drizzle-orm';
import { db } from './db';
import { products } from './db/schema';
import { Product } from './product';
import { IProductsRepository } from './interfaces/products.repository.interface';

export class ProductsRepository implements IProductsRepository {
  async createProduct(product: Product): Promise<Product> {
    try {
      const [created] = await db.insert(products).values(product).returning();

      if (created) {
        return {
          id: created.id,
          name: created.name,
          slug: created.slug,
          description: created.description ?? undefined,
          image: created.image,
          price: created.price,
          stripePriceId: created.stripePriceId,
          usesMonthlyQuota: created.usesMonthlyQuota ?? false,
          type: created.type,
          isVisible: created.isVisible ?? false,
          isFreeForSubscribers: created.isFreeForSubscribers,
        };
      } else {
        throw new Error('Cannot create a product');
      }
    } catch (error) {
      throw error;
    }
  }

  async getProduct(slug: string): Promise<Product | undefined> {
    const result = await db.query.products.findFirst({
      where: eq(products.slug, slug),
    });

    if (!result) return undefined;

    return {
      id: result.id,
      name: result.name,
      slug: result.slug,
      description: result.description ?? undefined,
      image: result.image,
      price: result.price,
      stripePriceId: result.stripePriceId,
      usesMonthlyQuota: result.usesMonthlyQuota ?? false,
      type: result.type,
      isVisible: result.isVisible ?? false,
      isFreeForSubscribers: result.isFreeForSubscribers,
    };
  }

  async getVisibleProductsByType(
    type: 'ebook' | 'live-lesson'
  ): Promise<Product[]> {
    try {
      const result = await db.query.products.findMany({
        where: and(eq(products.isVisible, true), eq(products.type, type)),
      });

      return result.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description ?? undefined,
        image: product.image,
        price: product.price,
        stripePriceId: product.stripePriceId,
        usesMonthlyQuota: product.usesMonthlyQuota ?? false,
        type: product.type,
        isVisible: product.isVisible ?? false,
        isFreeForSubscribers: product.isFreeForSubscribers,
      }));
    } catch (error) {
      throw error;
    }
  }
}
