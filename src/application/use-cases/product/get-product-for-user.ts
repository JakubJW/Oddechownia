import { IProductsRepository } from '@/application/repositories/products.repository.interface';
import { IPurchasesRepository } from '@/application/repositories/purchases.repository.interface';
import { ISubscriptionRepository } from '@/application/repositories/subscription.repository.interface';
import { SUBSCRIBER_ACCESS } from '@/entities/models/product';

export type ProductListItem = {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  priceId: string;
  subscriberAccess: SUBSCRIBER_ACCESS;
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
    const product = await this.productsRepository.getBySlug(slug);

    if (!product) return undefined;

    if (!userId) {
      const state = product.price > 0 ? 'can_purchase' : 'can_download';

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: product.image,
        price: product.price,
        priceId: product.priceId,
        subscriberAccess: product.subscriberAccess,
        state,
      };
    }

    const subscriptionStatus =
      await this.subscriptionRepository.getSubscriptionStatus(userId);
    const hasPurchased = await this.purchasesRepository.hasUserPurchasedProduct(
      product.id,
      userId
    );

    let state: ProductListItem['state'];

    if (hasPurchased) {
      state = 'can_download';
    } else if (
      product.subscriberAccess === 'free_unlimited' &&
      subscriptionStatus === 'active'
    ) {
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
      priceId: product.priceId,
      subscriberAccess: product.subscriberAccess,
      state,
    };
  }
}
