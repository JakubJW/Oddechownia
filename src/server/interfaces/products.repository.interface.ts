import { Product } from './product';

export interface IProductsRepository {
  createProduct(product: Product): Promise<Product>;
  getProduct(slug: string): Promise<Product | undefined>;
  getVisibleProductsByType(type: 'ebook' | 'live-lesson'): Promise<Product[]>;
}
