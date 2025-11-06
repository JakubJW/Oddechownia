import { stripeService } from './stripe.service';
import Stripe from 'stripe';

export type SubscriptionProductDTO = {
  id: string;
  name: string;
  description: string | null;
  priceId: string;
  amount: number;
  interval?: 'day' | 'week' | 'month' | 'year';
  intervalCount?: number;
  features: (string | undefined)[];
};

export const BillingService = {
  async getActiveSubscriptionProducts(): Promise<SubscriptionProductDTO[]> {
    const products = await stripeService.listProducts();
    const prices = await stripeService.listPrices();

    const productsMap = new Map<
      string,
      { product: Stripe.Product; prices: Stripe.Price[] }
    >();

    prices.data.forEach((price) => {
      const product = price.product as Stripe.Product;

      if (!productsMap.has(product.id)) {
        productsMap.set(product.id, {
          product: price.product as Stripe.Product,
          prices: [],
        });
      }

      const productEntry = productsMap.get(product.id);

      if (productEntry) {
        productEntry.prices.push(price);
      }
    });

    const result: SubscriptionProductDTO[] = [];

    for (const [productId, data] of productsMap.entries()) {
      const product = products.data.find((p) => p.id === productId);
      if (!product) continue;

      const primaryPrice = data.prices.find(
        (p) => p.recurring?.interval === 'month'
      );
      if (!primaryPrice) continue;

      result.push({
        id: product.id,
        name: product.name,
        description: product.description,
        priceId: primaryPrice.id,
        amount: primaryPrice.unit_amount ?? 0,
        interval: primaryPrice.recurring?.interval,
        intervalCount: primaryPrice.recurring?.interval_count,
        features: product.marketing_features.map(({ name }) => name),
      });
    }

    return result;
  },
};
