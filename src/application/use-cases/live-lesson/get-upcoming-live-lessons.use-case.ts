import { ILiveLessonsRepository } from '@/application/repositories/live-lessons.repository.interface';
import { IPurchasesRepository } from '@/application/repositories/purchases.repository.interface';
import { ISubscriptionRepository } from '@/application/repositories/subscription.repository.interface';
import {
  IProductCardStateStrategy,
  UserContext,
} from '@/application/strategies/product-purchase-state.strategy';
import { GuestProductCardStateStrategy } from '@/infrastructure/strategies/guest-product-card-state.strategy';
import { SubscriberProductCardStateStrategy } from '@/infrastructure/strategies/subscriber-product-card-state.strategy';
import { LiveLessonProduct, LiveLesson } from '@/entities/models/live-lesson';

export class GetUpcomingLiveLessonsForUser {
  private readonly MONTHLY_QUOTA_LIMIT = 2;

  constructor(
    private purchasesRepository: IPurchasesRepository,
    private subscriptionRepository: ISubscriptionRepository,
    private liveLessonsRepository: ILiveLessonsRepository
  ) {}

  async execute(userId?: string): Promise<LiveLessonProduct[]> {
    const lessons =
      await this.liveLessonsRepository.getVisibleUpcomingLiveLessons();

    const { context, strategy } = userId
      ? await this.prepareSubscriberContext(userId)
      : this.prepareGuestContext();

    return lessons.map((item) => this.mapToDTO(item, strategy, context));
  }

  private mapToDTO(
    item: LiveLesson,
    strategy: IProductCardStateStrategy,
    context: UserContext
  ): LiveLessonProduct {
    return {
      id: item.id,
      productId: item.productId,
      title: item.title,
      price: item.price,
      image: item.image,
      description: item.description,
      scheduledAt: item.scheduledAt,
      duration: item.duration,
      state: strategy.determineState({
        price: item.price,
        productId: item.id,
        subscriberAccess: item.subscriberAccess,
        userContext: context,
      }),
    };
  }

  private prepareGuestContext() {
    return {
      strategy: new GuestProductCardStateStrategy(),
      context: {
        userId: undefined,
        hasActiveSubscription: false,
        quotaUsage: 0,
        quotaLimit: 0,
        purchasedProductIds: [],
      },
    };
  }

  private async prepareSubscriberContext(userId: string) {
    const [subscriptionStatus, period, purchasedProductsIds] =
      await Promise.all([
        this.subscriptionRepository.getSubscriptionStatus(userId),
        this.subscriptionRepository.getCurrentSubscriptionPeriod(userId),
        this.purchasesRepository.getUserPurchasedProductIds(userId),
      ]);

    const usage = await this.purchasesRepository.getUserFreeQuotaUsage(
      userId,
      period.start,
      period.end
    );

    return {
      strategy: new SubscriberProductCardStateStrategy(),
      context: {
        userId,
        hasActiveSubscription: subscriptionStatus === 'active',
        quotaUsage: usage,
        quotaLimit: this.MONTHLY_QUOTA_LIMIT,
        purchasedProductIds: purchasedProductsIds,
      },
    };
  }
}
