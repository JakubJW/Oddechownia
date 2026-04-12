import { ILiveLessonsRepository } from '@/application/repositories/live-lessons.repository.interface';
import { IPurchasesRepository } from '@/application/repositories/purchases.repository.interface';
import { NotFoundError } from '@/server/lib/errors';

export class GetLiveLessonPurchasesListUseCase {
  constructor(
    private purchasesRepository: IPurchasesRepository,
    private liveLessonsRepository: ILiveLessonsRepository
  ) {}

  async execute(id: string) {
    const lesson = await this.liveLessonsRepository.getById(id);

    if (!lesson.productId) {
      throw new NotFoundError('Product');
    }

    const result = await this.purchasesRepository.findByProductId(
      lesson.productId
    );

    return result.map((purchase) => ({
      id: purchase.id,
      email: purchase.email,
      acquisitionMethod: purchase.acquisitionMethod,
      createdAt: purchase.createdAt,
    }));
  }
}
