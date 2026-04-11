import {
  IPurchaseStrategy,
  PurchaseContext,
} from '@/application/strategies/purchase.strategy.interface';
import { PRODUCT_TYPE } from '@/entities/models/product';
import { EmailService } from '@/server/services/emails.service';
import { ILiveLessonsRepository } from '@/application/repositories/live-lessons.repository.interface';
import { IPurchasesRepository } from '@/application/repositories/purchases.repository.interface';

export class LiveLessonPurchaseStrategy implements IPurchaseStrategy {
  readonly type = PRODUCT_TYPE.LIVE_LESSON;

  constructor(
    private liveLessonRepository: ILiveLessonsRepository,
    // private emailService: IEmailService,
    private purchaseRepository: IPurchasesRepository
  ) {}

  async handle(ctx: PurchaseContext): Promise<void> {
    console.log('Processing payment fulfillment with context: ', ctx);

    const [lesson] = await this.liveLessonRepository.getByProductId([
      ctx.productId,
    ]);

    await EmailService.sendLiveLessonRegistrationConfirmaion(
      ctx.email,
      lesson.title,
      lesson.scheduledAt
    );

    await EmailService.scheduleLiveLessonRemind(
      ctx.email,
      lesson.title,
      lesson.scheduledAt
    );
  }
}
