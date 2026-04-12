import { Product } from '@/entities/models/product';

export interface IProductsRepository {
  getById(id: string): Promise<Product | undefined>;
  getBySlug(slug: string): Promise<Product | undefined>;
  getVisibleProductsByType(type: 'ebook' | 'live-lesson'): Promise<Product[]>;
}
