import { ProductType } from '@/entities/models/product';

export interface PurchaseContext {
  userId?: string;
  productId: string;
  checkoutSessionId: string;
  metadata: Record<string, string>;
}

export interface IPurchaseStrategy {
  type: ProductType;
  handle(context: PurchaseContext): Promise<void>;
}
