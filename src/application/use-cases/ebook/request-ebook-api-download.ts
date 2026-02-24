import { IEbooksRepository } from '@/application/repositories/ebooks.repository.interface';
import { IProductsRepository } from '@/application/repositories/products.repository.interface';
import { IStorageService } from '@/application/services/storage.service.interface';

export class RequestEbookApiDownload {
  constructor(
    private productsRepository: IProductsRepository,
    private ebooksRepository: IEbooksRepository,
    private storageService: IStorageService
  ) {}

  async execute(slug: string): Promise<string> {
    const product = await this.productsRepository.getBySlug(slug);

    if (!product) {
      throw new Error('Product not found');
    }

    const ebook = await this.ebooksRepository.getEbookByProductId(product.id);

    if (!ebook) {
      throw new Error('Ebook not found');
    }

    return this.storageService.generateSignedUrl(
      'private-assets',
      ebook.path,
      60,
      true
    );
  }
}
