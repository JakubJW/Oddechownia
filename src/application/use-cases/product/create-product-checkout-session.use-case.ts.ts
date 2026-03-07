import { env } from '@/env';
import { IPaymentService } from '@/application/services/payment.service.interface';
import { IProductsRepository } from '@/application/repositories/products.repository.interface';
import { IPurchasesRepository } from '@/application/repositories/purchases.repository.interface';
import { User } from '../../../entities/models/user';
import { PRODUCT_TYPE } from '@/entities/models/product';

export class CreateProductCheckoutSessionUseCase {
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

    const cancelRoute =
      product.type === PRODUCT_TYPE.LIVE_LESSON
        ? 'zajecia-na-zywo'
        : 'produkty';

    const session = await this.stripePaymentService.createCheckoutSession({
      priceId: product.priceId,
      successUrl: `${env.NEXT_PUBLIC_APP_URL}/produkty/podsumowanie/{CHECKOUT_SESSION_ID}`,
      cancelUrl: `${env.NEXT_PUBLIC_APP_URL}/${cancelRoute}`,
      metadata: {
        userId: user?.id,
        productId: product.id,
        productType: product.type,
      },
    });

    return session.url;
  }
}
