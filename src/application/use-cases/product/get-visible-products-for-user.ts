import { IProductsRepository } from '@/application/repositories/products.repository.interface';
import { IPurchasesRepository } from '@/application/repositories/purchases.repository.interface';
import { ISubscriptionRepository } from '@/application/repositories/subscription.repository.interface';
import { SubscriberAccess } from '@/entities/models/product';

export type ProductListItem = {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  subscriberAccess: SubscriberAccess;
  state: 'can_download' | 'can_claim' | 'can_purchase';
};

export class GetVisibleProductsForUser {
  constructor(
    private productsRepository: IProductsRepository,
    private purchasesRepository: IPurchasesRepository,
    private subscriptionRepository: ISubscriptionRepository
  ) {}

  async execute(userId?: string): Promise<ProductListItem[]> {
    const products =
      await this.productsRepository.getVisibleProductsByType('ebook');

    if (!userId) {
      return products.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: product.image,
        price: product.price,
        subscriberAccess: product.subscriberAccess,
        state: 'can_purchase',
      }));
    }

    const hasSubscription =
      await this.subscriptionRepository.hasActiveSubscriptionAfterTrial(userId);

    const results: ProductListItem[] = [];

    for (const product of products) {
      const hasPurchased =
        await this.purchasesRepository.hasUserPurchasedProduct(
          product.id,
          userId
        );

      let state: ProductListItem['state'];

      if (hasPurchased) {
        state = 'can_download';
      } else if (
        product.subscriberAccess === 'free_unlimited' &&
        hasSubscription
      ) {
        state = 'can_claim';
      } else {
        state = 'can_purchase';
      }

      results.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: product.image,
        price: product.price,
        subscriberAccess: product.subscriberAccess,
        state,
      });
    }

    return results;
  }
}
