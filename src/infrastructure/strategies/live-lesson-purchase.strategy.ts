import {
  IPurchaseStrategy,
  PurchaseContext,
} from '@/application/strategies/purchase.strategy.interface';

export class LiveLessonPurchaseStrategy implements IPurchaseStrategy {
  readonly type = 'live-lesson';

  constructor() {
    // private emailService: IEmailService,
    // private liveLessonRepo: ILiveLessonRepository
  }

  async handle(ctx: PurchaseContext): Promise<void> {
    // const lessonDetails = await this.liveLessonRepo.findByProductId(
    //   ctx.productId
    // );

    // if (!lessonDetails) throw new Error('Live lesson details not found');

    // 2. Tu możesz wykonać logikę "legacy" jeśli nadal potrzebujesz tabeli registrations,
    // ale docelowo tabela 'purchases' powinna wystarczyć do sprawdzenia czy ktoś ma wstęp.

    // 3. Wyślij maile (logika przeniesiona z Twojego starego serwisu)
    // Zakładamy, że userId pozwala pobrać email użytkownika
    // await this.emailService.sendLiveLessonRegistrationConfirmaion(...)
    // await this.emailService.scheduleLiveLessonRemind(...)

    console.log(`Live lesson specific logic executed for ${ctx.productId}`);
  }
}
