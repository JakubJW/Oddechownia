import {
  IProductCardStateStrategy,
  StrategyContext,
} from '@/application/strategies/product-purchase-state.strategy';
import { PURCHASE_STATE } from '@/entities/models/purchase';

export class GuestProductCardStateStrategy implements IProductCardStateStrategy {
  determineState(context: StrategyContext): PURCHASE_STATE {
    return context.price > 0
      ? PURCHASE_STATE.CAN_PURCHASE
      : PURCHASE_STATE.CAN_CLAIM;
  }
}
