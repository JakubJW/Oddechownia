import { PRODUCT_TYPE } from '@/entities/models/product';

export interface IPaymentService {
  createCheckoutSession(params: {
    priceId: string;
    successUrl: string;
    cancelUrl: string;
    metadata: {
      userId?: string;
      productId: string;
      productType: PRODUCT_TYPE;
    };
  }): Promise<{ url: string }>;
}
