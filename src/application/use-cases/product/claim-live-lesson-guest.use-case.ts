import { ILiveLessonsRepository } from '@/application/repositories/live-lessons.repository.interface';
import { IPurchasesRepository } from '@/application/repositories/purchases.repository.interface';
import { ACQUISITION_METHOD } from '@/entities/models/purchase';
import { EmailService } from '@/server/services/emails.service';

export class ClaimLiveLessonGuestUseCase {
  constructor(
    private purchasesRepository: IPurchasesRepository,
    private liveLessonsRepository: ILiveLessonsRepository
  ) {}

  async execute(userEmail: string, productId: string) {
    const [lesson] = await this.liveLessonsRepository.getByProductId([
      productId,
    ]);

    if (!lesson) {
      throw new Error('Product not found');
    }

    const hasPurchasedProduct =
      await this.purchasesRepository.hasUserEmailPurchasedProduct(
        productId,
        userEmail
      );

    if (hasPurchasedProduct) {
      throw new Error('Aleady claimed');
    }

    await this.purchasesRepository.create({
      email: userEmail,
      productId: lesson.id,
      acquisitionMethod: ACQUISITION_METHOD.FREE_PUBLIC,
    });

    await EmailService.sendLiveLessonRegistrationConfirmaion(
      userEmail,
      lesson.title,
      lesson.scheduledAt
    );

    await EmailService.scheduleLiveLessonRemind(
      userEmail,
      lesson.title,
      lesson.scheduledAt
    );

    return { success: true, message: 'Access granted' };
  }
}
