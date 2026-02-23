import { IProductsRepository } from '@/application/repositories/products.repository.interface';
import { IPurchasesRepository } from '@/application/repositories/purchases.repository.interface';
import { ISubscriptionRepository } from '@/application/repositories/subscription.repository.interface';
import { AcquisitionMethod } from '@/entities/models/purchase';
import { User } from '@/entities/models/user';

export class ClaimProductUseCase {
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

    const acquisitionMethod: AcquisitionMethod = 'subscription_benefit';

    // if (product.price === 0) {
    //   acquisitionMethod = 'free_public';
    // } else if (hasActiveSubscription) {
    //   if (product.subscriberAccess === 'free_unlimited') {
    //     acquisitionMethod = 'subscription_benefit';
    //   } else if (product.subscriberAccess === 'quota_based') {
    //     const usage =
    //       await this.purchasesRepository.countMonthlyQuotaUsage(userId);
    //     if (usage >= 2) throw new Error('Monthly quota exceeded');
    //     acquisitionMethod = 'subscription_quota';
    //   } else {
    //     throw new Error('This product is not included in subscription');
    //   }
    // } else {
    //   throw new Error('Payment required');
    // }

    await this.purchasesRepository.create({
      email: user.email,
      userId: user.id,
      productId: product.id,
      acquisitionMethod,
    });

    return { success: true, message: 'Access granted' };
  }
}
