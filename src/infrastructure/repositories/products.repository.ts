import { and, eq } from 'drizzle-orm';
import { products } from '@/server/db/schema';
import {
  Product,
  PRODUCT_TYPE,
  SUBSCRIBER_ACCESS,
} from '@/entities/models/product';
import { IProductsRepository } from '@/application/repositories/products.repository.interface';
import { db } from '@/server/db';

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
          priceId: created.priceId,
          type: created.type as PRODUCT_TYPE,
          isVisible: created.isVisible ?? false,
          subscriberAccess: created.subscriberAccess as SUBSCRIBER_ACCESS,
        };
      } else {
        throw new Error('Cannot create a product');
      }
    } catch (error) {
      throw error;
    }
  }

  async getBySlug(slug: string): Promise<Product | undefined> {
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
      priceId: result.priceId,
      subscriberAccess: result.subscriberAccess as SUBSCRIBER_ACCESS,
      type: result.type as PRODUCT_TYPE,
      isVisible: result.isVisible ?? false,
    };
  }

  async getById(id: string): Promise<Product | undefined> {
    const result = await db.query.products.findFirst({
      where: eq(products.id, id),
    });

    if (!result) return undefined;

    return {
      id: result.id,
      name: result.name,
      slug: result.slug,
      description: result.description ?? undefined,
      image: result.image,
      price: result.price,
      priceId: result.priceId,
      subscriberAccess: result.subscriberAccess as SUBSCRIBER_ACCESS,
      type: result.type as PRODUCT_TYPE,
      isVisible: result.isVisible ?? false,
    };
  }

  async getVisibleProductsByType(type: PRODUCT_TYPE): Promise<Product[]> {
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
        priceId: product.priceId,
        type: product.type as PRODUCT_TYPE,
        isVisible: product.isVisible ?? false,
        subscriberAccess: product.subscriberAccess as SUBSCRIBER_ACCESS,
      }));
    } catch (error) {
      throw error;
    }
  }
}
