import {
  IProductCardStateStrategy,
  StrategyContext,
} from '@/application/strategies/product-purchase-state.strategy';
import { SUBSCRIBER_ACCESS } from '@/entities/models/product';
import { PURCHASE_STATE } from '@/entities/models/purchase';

export class SubscriberProductCardStateStrategy implements IProductCardStateStrategy {
  determineState(context: StrategyContext): PURCHASE_STATE {
    if (context.userContext.purchasedProductIds.includes(context.productId)) {
      return PURCHASE_STATE.PURCHASED;
    }

    switch (context.subscriberAccess) {
      case SUBSCRIBER_ACCESS.FREE_UNLIMITED:
        return PURCHASE_STATE.CAN_CLAIM;

      case SUBSCRIBER_ACCESS.PAID:
        return PURCHASE_STATE.CAN_PURCHASE;

      case SUBSCRIBER_ACCESS.QUOTA_BASED:
        return context.userContext.quotaUsage >= context.userContext.quotaLimit
          ? PURCHASE_STATE.CAN_PURCHASE
          : PURCHASE_STATE.CAN_CLAIM;

      default:
        return PURCHASE_STATE.CAN_CLAIM;
    }
  }
}
