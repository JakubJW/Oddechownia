import { PRODUCT_TYPE } from '@/entities/models/product';

export interface PurchaseContext {
  userId?: string;
  productId: string;
  checkoutSessionId: string;
  metadata: Record<string, string>;
}

export interface IPurchaseStrategy {
  type: PRODUCT_TYPE;
  handle(context: PurchaseContext): Promise<void>;
}
