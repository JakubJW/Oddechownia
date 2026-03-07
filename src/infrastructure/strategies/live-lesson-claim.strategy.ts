import { IPurchasesRepository } from '@/application/repositories/purchases.repository.interface';
import { ISubscriptionRepository } from '@/application/repositories/subscription.repository.interface';
import {
  ClaimProductContext,
  IClaimStrategy,
} from '@/application/strategies/claim.strategy';
import { PRODUCT_TYPE, SUBSCRIBER_ACCESS } from '@/entities/models/product';
import { ACQUISITION_METHOD } from '@/entities/models/purchase';

export class LiveLessonClaimStrategy implements IClaimStrategy {
  readonly type = PRODUCT_TYPE.LIVE_LESSON;

  constructor(
    private subscriptionRepository: ISubscriptionRepository,
    private purchasesRepository: IPurchasesRepository
  ) {}

  public async handle(context: ClaimProductContext) {
    if (!context.userId) {
      await this.purchasesRepository.create({
        email: context.email,
        userId: context.userId,
        productId: context.productId,
        acquisitionMethod: ACQUISITION_METHOD.FREE_PUBLIC,
      });

      return;
    }

    const hasActiveSubscription =
      await this.subscriptionRepository.hasActiveSubscriptionAfterTrial(
        context.userId
      );

    if (!hasActiveSubscription) {
      throw new Error('Inactive subscription');
    }

    const hasPurchasedProduct =
      await this.purchasesRepository.hasUserPurchasedProduct(
        context.productId,
        context.userId
      );

    if (hasPurchasedProduct) {
      throw new Error('Already claimed');
    }

    await this.purchasesRepository.create({
      email: context.email,
      userId: context.userId,
      productId: context.productId,
      acquisitionMethod:
        context.subscriberAccess === SUBSCRIBER_ACCESS.QUOTA_BASED
          ? ACQUISITION_METHOD.SUBSCRIPTION_QUOTA
          : ACQUISITION_METHOD.SUBSCRIPTION_BENEFIT,
    });
  }
}
