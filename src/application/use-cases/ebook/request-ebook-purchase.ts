import { env } from '@/env';
import { IPaymentService } from '@/application/services/payment.service.interface';
import { IProductsRepository } from '@/application/repositories/products.repository.interface';
import { IPurchasesRepository } from '@/application/repositories/purchases.repository.interface';
import { User } from '../../../entities/models/user';

export class RequestEbookPurchase {
  constructor(
    private productsRepository: IProductsRepository,
    private purchasesRepository: IPurchasesRepository,
    private stripePaymentService: IPaymentService
  ) {}

  async execute(productId: string, user?: User): Promise<string> {
    const product = await this.productsRepository.getById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    const alreadyPurchased =
      await this.purchasesRepository.hasUserPurchasedProduct(
        product.id,
        user?.id
      );

    if (alreadyPurchased) {
      throw new Error('Forbidden');
    }

    const session = await this.stripePaymentService.createCheckoutSession({
      priceId: product.priceId,
      successUrl: `${env.NEXT_PUBLIC_APP_URL}/sukces`,
      cancelUrl: `${env.NEXT_PUBLIC_APP_URL}/oferta/${product.slug}`,
      metadata: {
        userId: user?.id,
        productId: product.id,
        productType: product.type,
      },
    });

    return session.url;
  }
}
