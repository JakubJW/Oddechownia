import { IPaymentService } from '../interfaces/payment.service.interface';
import { IProductsRepository } from '../interfaces/products.repository.interface';

export class CreateProductCheckoutSession {
  constructor(
    private productsRepository: IProductsRepository,
    private paymentService: IPaymentService
  ) {}

  async execute(userId: string, productSlug: string) {
    const product = await this.productsRepository.getProduct(productSlug);

    if (!product) {
      throw new Error('Product not found');
    }

    if (!product.stripePriceId) {
      throw new Error('Product not configured for payment');
    }

    return this.paymentService.createCheckoutSession({
      userId,
      productId: product.id,
      priceId: product.stripePriceId,
      successUrl: `${process.env.APP_URL}/success`,
      cancelUrl: `${process.env.APP_URL}/cancel`,
    });
  }
}
