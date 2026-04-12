import { SUBSCRIBER_ACCESS } from '@/entities/models/product';
import { PURCHASE_STATE } from '@/entities/models/purchase';

export interface UserContext {
  userId?: string;
  hasActiveSubscription: boolean;
  quotaUsage: number;
  quotaLimit: number;
  purchasedProductIds: string[];
}

export interface StrategyContext {
  productId: string;
  price: number;
  subscriberAccess?: SUBSCRIBER_ACCESS;
  userContext: UserContext;
}

export interface IProductCardStateStrategy {
  determineState(context: StrategyContext): PURCHASE_STATE;
}
