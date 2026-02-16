export interface IPaymentService {
  createCheckoutSession(params: {
    userId?: string;
    productId: string;
    priceId: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<{ url: string }>;
}
