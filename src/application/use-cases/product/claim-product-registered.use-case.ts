import { IProductsRepository } from '@/application/repositories/products.repository.interface';
import { IPurchasesRepository } from '@/application/repositories/purchases.repository.interface';
import { ISubscriptionRepository } from '@/application/repositories/subscription.repository.interface';
import { SUBSCRIBER_ACCESS } from '@/entities/models/product';
import { ACQUISITION_METHOD } from '@/entities/models/purchase';
import { User } from '@/entities/models/user';

export class ClaimProductRegisteredUseCase {
  constructor(
    private productsRepository: IProductsRepository,
    private purchasesRepository: IPurchasesRepository,
    private subscriptionRepository: ISubscriptionRepository
  ) {}

  async execute(user: User, productId: string) {
    const product = await this.productsRepository.getById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    const hasActiveSubscription =
      await this.subscriptionRepository.hasActiveSubscriptionAfterTrial(
        user.id
      );

    if (!hasActiveSubscription) {
      throw new Error('Inactive subscription');
    }

    const hasPurchasedProduct =
      await this.purchasesRepository.hasUserPurchasedProduct(
        product.id,
        user.id
      );

    if (hasPurchasedProduct) {
      throw new Error('Already claimed');
    }

    await this.purchasesRepository.create({
      email: user.email,
      userId: user.id,
      productId: product.id,
      acquisitionMethod:
        product.subscriberAccess === SUBSCRIBER_ACCESS.QUOTA_BASED
          ? ACQUISITION_METHOD.SUBSCRIPTION_QUOTA
          : ACQUISITION_METHOD.SUBSCRIPTION_BENEFIT,
    });

    return { success: true, message: 'Access granted' };
  }
}
