import { PRODUCT_TYPE, SUBSCRIBER_ACCESS } from '@/entities/models/product';

export interface ClaimProductContext {
  userId?: string;
  email: string;
  fullName: string;
  productId: string;
  subscriberAccess: SUBSCRIBER_ACCESS;
}

export interface IClaimStrategy {
  type: PRODUCT_TYPE;
  handle(context: ClaimProductContext): Promise<void>;
}
