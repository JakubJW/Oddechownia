import { IEbooksRepository } from '@/application/repositories/ebooks.repository.interface';
import { IProductsRepository } from '@/application/repositories/products.repository.interface';
import { IPurchasesRepository } from '@/application/repositories/purchases.repository.interface';
import { IStorageService } from '@/application/services/storage.service.interface';

export class RequestEbookDownload {
  constructor(
    private productsRepository: IProductsRepository,
    private purchasesRepository: IPurchasesRepository,
    private ebooksRepository: IEbooksRepository,
    private storageService: IStorageService
  ) {}

  async execute(userId: string, productId: string): Promise<string> {
    const product = await this.productsRepository.getById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    const hasAccess = await this.purchasesRepository.hasUserPurchasedProduct(
      product.id,
      userId
    );

    if (!hasAccess) {
      throw new Error('Forbidden');
    }

    const ebook = await this.ebooksRepository.getEbookByProductId(product.id);

    if (!ebook) {
      throw new Error('Ebook not found');
    }

    return this.storageService.generateSignedUrl(
      'private-assets',
      ebook.path,
      60
    );
  }
}
