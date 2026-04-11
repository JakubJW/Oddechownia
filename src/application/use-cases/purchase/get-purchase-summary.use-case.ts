import { ILiveLessonsRepository } from '@/application/repositories/live-lessons.repository.interface';
import { IPurchasesRepository } from '@/application/repositories/purchases.repository.interface';
import { PRODUCT_TYPE } from '@/entities/models/product';
import { ACQUISITION_METHOD } from '@/entities/models/purchase';
import { NotFoundError } from '@/server/lib/errors';

type SummaryResult =
  | {
      productType: PRODUCT_TYPE.LIVE_LESSON;
      acquisitionMethod: ACQUISITION_METHOD;
      purchasedAsGuest: boolean;
      lessonData: {
        title: string;
        scheduledAt: string;
        image: string;
        duration: number;
      };
    }
  | { productType: PRODUCT_TYPE.EBOOK };

export class GetPurchaseSummaryUseCase {
  constructor(
    private purchasesRepository: IPurchasesRepository,
    private liveLessonsRepository: ILiveLessonsRepository
  ) {}

  async execute(sessionId: string): Promise<SummaryResult> {
    const purchase = await this.purchasesRepository.findBySessionId(sessionId);

    if (!purchase) {
      throw new NotFoundError('Purchases');
    }

    if (purchase.productType === PRODUCT_TYPE.LIVE_LESSON) {
      const [lesson] = await this.liveLessonsRepository.getByProductId([
        purchase.productId,
      ]);

      return {
        productType: PRODUCT_TYPE.LIVE_LESSON,
        acquisitionMethod: purchase.acquisitionMethod,
        purchasedAsGuest: purchase.userId === undefined,
        lessonData: {
          title: lesson.title,
          scheduledAt: lesson.scheduledAt,
          image: lesson.image,
          duration: lesson.duration,
        },
      };
    }

    return {
      productType: PRODUCT_TYPE.EBOOK,
    };
  }
}
