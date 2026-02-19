import Stripe from 'stripe';
import { stripeClient } from '@/stripe/stripe';
import { IPaymentService } from '@/application/services/payment.service.interface';
import { ProductType } from '@/entities/models/product';

export class StripePaymentService implements IPaymentService {
  private stripe: Stripe;

  constructor(stripe: Stripe = stripeClient) {
    this.stripe = stripe;
  }

  async createCheckoutSession(params: {
    priceId: string;
    successUrl: string;
    cancelUrl: string;
    metadata: {
      userId?: string;
      productId: string;
      productType: ProductType;
    };
  }) {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: params.priceId,
          quantity: 1,
        },
      ],
      metadata: params.metadata,
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
    });

    if (!session.url) {
      throw new Error('Cannot create checkout session');
    }

    return { url: session.url };
  }
}
