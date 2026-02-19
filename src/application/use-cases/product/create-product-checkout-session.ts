import { IPaymentService } from '@/application/services/payment.service.interface';
import { IProductsRepository } from '@/application/repositories/products.repository.interface';

export class CreateProductCheckoutSession {
  constructor(
    private productsRepository: IProductsRepository,
    private paymentService: IPaymentService
  ) {}

  async execute(productSlug: string, userId?: string) {
    const product = await this.productsRepository.getBySlug(productSlug);

    if (!product) {
      throw new Error('Product not found');
    }

    if (!product.priceId) {
      throw new Error('Product not configured for payment');
    }

    return this.paymentService.createCheckoutSession({
      metadata: {
        userId,
        productId: product.id,
        productType: product.type,
      },
      priceId: product.priceId,
      successUrl: `${process.env.APP_URL}/success`,
      cancelUrl: `${process.env.APP_URL}/cancel`,
    });
  }
}
