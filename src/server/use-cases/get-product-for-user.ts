import { IProductsRepository } from '../products.repository.interface';
import { IPurchasesRepository } from '../interfaces/purchases.repository.interface';
import { ISubscriptionRepository } from '../interfaces/subscription.repository.interface';

export type ProductListItem = {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  stripePriceId: string;
  isFreeForSubscribers: boolean;
  state: 'can_download' | 'can_claim' | 'can_purchase';
};

export class GetProductForUser {
  constructor(
    private productsRepository: IProductsRepository,
    private purchasesRepository: IPurchasesRepository,
    private subscriptionRepository: ISubscriptionRepository
  ) {}

  async execute(
    slug: string,
    userId?: string
  ): Promise<ProductListItem | undefined> {
    const product = await this.productsRepository.getProduct(slug);

    if (!product) return undefined;

    if (!userId) {
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: product.image,
        price: product.price,
        stripePriceId: product.stripePriceId,
        isFreeForSubscribers: product.isFreeForSubscribers,
        state: 'can_purchase',
      };
    }

    const hasSubscription =
      await this.subscriptionRepository.hasActiveSubscriptionAfterTrial(userId);

    const hasPurchased = await this.purchasesRepository.hasUserPurchasedProduct(
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

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: product.price,
      stripePriceId: product.stripePriceId,
      isFreeForSubscribers: product.isFreeForSubscribers,
      state,
    };
  }
}
