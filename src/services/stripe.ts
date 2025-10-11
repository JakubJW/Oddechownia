import Stripe from 'stripe';
import { env } from '@/env';

class StripeService {
  private static _instance: StripeService;
  private stripe: Stripe;

  private constructor() {
    const secret = env.NEXT_STRIPE_API_SECRET;
    this.stripe = new Stripe(secret, { typescript: true });
  }

  public static getInstance(): StripeService {
    if (!StripeService._instance) {
      StripeService._instance = new StripeService();
    }
    return StripeService._instance;
  }

  public async createCheckoutSession(
    params: Stripe.Checkout.SessionCreateParams
  ): Promise<Stripe.Checkout.Session> {
    try {
      const session = await this.stripe.checkout.sessions.create(params);
      return session;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  public async createCustomer(
    params: Stripe.CustomerCreateParams
  ): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.create(params);
      return customer;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  public async createProduct(
    params: Stripe.ProductCreateParams
  ): Promise<Stripe.Product> {
    try {
      const product = await this.stripe.products.create(params);
      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  public async getProduct(productId: string) {
    try {
      const product = await this.stripe.products.retrieve(productId);
      return product;
    } catch (error) {
      console.error('Error retrieving product:', error);
      throw error;
    }
  }
  public async createPrice(
    params: Stripe.PriceCreateParams
  ): Promise<Stripe.Price> {
    try {
      const price = await this.stripe.prices.create(params);
      return price;
    } catch (error) {
      console.error('Error creating price:', error);
      throw error;
    }
  }

  public constructWebhookEvent(
    rawBody: string | Buffer,
    signature: string
  ): Stripe.Event {
    try {
      return this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        env.NEXT_STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      console.error('Error constructing webhook event:', error);
      throw error;
    }
  }

  public async createPortalSession(params: Stripe.BillingPortal.SessionCreateParams) {
    try {
      const portalSession = await this.stripe.billingPortal.sessions.create(
        params
      );

      return portalSession.url;
    } catch (error) {
      console.error('Error constructing portal session:', error);
      throw error;
    }
  }
}

export const stripeService = StripeService.getInstance();
