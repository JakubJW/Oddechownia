import {
  IPurchaseStrategy,
  PurchaseContext,
} from '@/application/strategies/purchase.strategy.interface';
import { PRODUCT_TYPE } from '@/entities/models/product';

export class EbookPurchaseStrategy implements IPurchaseStrategy {
  readonly type = PRODUCT_TYPE.EBOOK;

  constructor() {
    // private emailService: IEmailService
  }

  async handle(ctx: PurchaseContext): Promise<void> {
    // Ebooki są proste - dostęp wynika z rekordu w tabeli 'purchases'.
    // Opcjonalnie: wyślij maila z podziękowaniem/linkiem.
    // const user = await userRepository.findById(ctx.userId);
    // await this.emailService.sendEbookLink(user.email, ...);
    console.log(`Processing ebook purchase for product ${ctx.productId}`);
  }
}
