import { CreateProductCheckoutSessionUseCase } from '@/application/use-cases/product/create-product-checkout-session.use-case.ts';
import { ProductsRepository } from '@/infrastructure/repositories/products.repository';
import { PurchasesRepository } from '@/infrastructure/repositories/purchases.repository';
import { StripePaymentService } from '@/infrastructure/services/payment.service';
import { UserService } from '@/infrastructure/services/user.service';
import { Params } from '@/types/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Params<{ id: string }> }
) {
  const { id } = await params;

  const userService = new UserService();
  const user = await userService.getUser();

  const useCase = new CreateProductCheckoutSessionUseCase(
    new ProductsRepository(),
    new PurchasesRepository(),
    new StripePaymentService()
  );
  const sessionUrl = await useCase.execute(id, user);

  return NextResponse.json({ url: sessionUrl }, { status: 200 });
}
