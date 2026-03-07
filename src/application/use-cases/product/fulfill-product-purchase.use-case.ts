import Stripe from 'stripe';
import { IPurchaseStrategy } from '@/application/strategies/purchase.strategy.interface';
import { IPurchasesRepository } from '@/application/repositories/purchases.repository.interface';
import { ACQUISITION_METHOD } from '@/entities/models/purchase';

export class FulfillPurchaseUseCase {
  private strategies: Map<string, IPurchaseStrategy>;

  constructor(
    private purchasesRepo: IPurchasesRepository,
    strategies: IPurchaseStrategy[]
  ) {
    this.strategies = new Map(strategies.map((s) => [s.type, s]));
  }

  async execute(params: {
    checkoutSessionId: string;
    stripePaymentStatus: string;
    userEmail: string;
    metadata: Stripe.Metadata;
  }) {
    const { checkoutSessionId, stripePaymentStatus, metadata } = params;

    if (stripePaymentStatus !== 'paid') {
      throw new Error('Payment not completed');
    }

    const { productId, userId, productType } = metadata;

    if (!productId || !productType) {
      throw new Error(
        'Missing required metadata (productId, userId, or productType)'
      );
    }

    const existingPurchase =
      await this.purchasesRepo.findBySessionId(checkoutSessionId);

    if (!existingPurchase) {
      await this.purchasesRepo.create({
        email: params.userEmail,
        productId,
        userId,
        checkoutSessionId,
        acquisitionMethod: ACQUISITION_METHOD.PAYMENT,
      });

      const strategy = this.strategies.get(productType);

      if (strategy) {
        await strategy.handle({
          userId,
          productId,
          checkoutSessionId,
          metadata,
        });
      } else {
        console.warn(`No strategy found for product type: ${productType}`);
      }
    }

    return { success: true };
  }
}
