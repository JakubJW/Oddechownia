import { PRODUCT_TYPE } from '@/entities/models/product';

export interface PurchaseContext {
  userId?: string;
  email: string;
  productId: string;
  checkoutSessionId: string;
  metadata: Record<string, string>;
}

type EbookPurchaseResult = void;
type LiveLessonPurchaseResult = {
  title: string;
  scheduledAt: string;
};

type PurchaseResult = EbookPurchaseResult | LiveLessonPurchaseResult;

export interface IPurchaseStrategy {
  type: PRODUCT_TYPE;
  handle(context: PurchaseContext): Promise<PurchaseResult>;
}
