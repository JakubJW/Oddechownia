import { IEbooksRepository } from '../interfaces/ebooks.repository.interface';
import { IProductsRepository } from '../interfaces/products.repository.interface';
import { IPurchasesRepository } from '../interfaces/purchases.repository.interface';
import { IStorageService } from '../interfaces/storage.service.interface';

export class RequestEbookDownload {
  constructor(
    private productsRepository: IProductsRepository,
    private purchasesRepository: IPurchasesRepository,
    private ebooksRepository: IEbooksRepository,
    private storageService: IStorageService
  ) {}

  async execute(userId: string, productSlug: string): Promise<string> {
    const product = await this.productsRepository.getProduct(productSlug);

    if (!product) {
      throw new Error('Product not found');
    }

    const hasAccess = await this.purchasesRepository.hasUserPurchasedProduct(
      userId,
      product.id
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
