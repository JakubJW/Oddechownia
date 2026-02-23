import { Product } from '@/entities/models/product';

export interface IProductsRepository {
  createProduct(product: Product): Promise<Product>;
  getById(id: string): Promise<Product | undefined>;
  getBySlug(slug: string): Promise<Product | undefined>;
  getVisibleProductsByType(type: 'ebook' | 'live-lesson'): Promise<Product[]>;
}
