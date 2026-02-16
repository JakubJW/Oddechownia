import { IProductsRepository } from '../products.repository.interface';
import { IPurchasesRepository } from '../interfaces/purchases.repository.interface';
import { ISubscriptionRepository } from '../interfaces/subscription.repository.interface';

export type ProductListItem = {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  isFreeForSubscribers: boolean;
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
        isFreeForSubscribers: product.isFreeForSubscribers,
        state: 'can_purchase',
      }));
    }

    const hasSubscription =
      await this.subscriptionRepository.hasActiveSubscriptionAfterTrial(userId);

    const results: ProductListItem[] = [];

    for (const product of products) {
      const hasPurchased =
        await this.purchasesRepository.hasUserPurchasedProduct(
          userId,
          product.id
        );

      let state: ProductListItem['state'];

      if (hasPurchased) {
        state = 'can_download';
      } else if (product.isFreeForSubscribers && hasSubscription) {
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
        isFreeForSubscribers: product.isFreeForSubscribers,
        state,
      });
    }

    return results;
  }
}
