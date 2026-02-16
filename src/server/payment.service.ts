import Stripe from 'stripe';
import { IPaymentService } from './interfaces/payment.service.interface';

export class StripePaymentService implements IPaymentService {
  constructor(private stripe: Stripe) {}

  async createCheckoutSession(params: {
    priceId: string;
    productId: string;
    successUrl: string;
    cancelUrl: string;
    userId?: string;
  }) {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: params.priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: params.userId ? params.userId : null,
        productId: params.productId,
      },
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
    });

    if (!session.url) {
      throw new Error('Cannot create checkout session');
    }

    return { url: session.url };
  }
}
