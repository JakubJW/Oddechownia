import { Params } from '@/types/types';
import { NextRequest, NextResponse } from 'next/server';
import { ClaimProductUseCase } from '@/application/use-cases/product/claim-product';
import { UserService } from '@/infrastructure/services/user.service';
import { ProductsRepository } from '@/infrastructure/repositories/products.repository';
import { PurchasesRepository } from '@/infrastructure/repositories/purchases.repository';
import { SubscriptionRepository } from '@/infrastructure/repositories/subscription.repository';

export async function POST(
  req: NextRequest,
  { params }: { params: Params<{ id: string }> }
) {
  const { id } = await params;

  const userService = new UserService();

  const claimProductUseCase = new ClaimProductUseCase(
    new ProductsRepository(),
    new PurchasesRepository(),
    new SubscriptionRepository()
  );

  const user = await userService.getUser();

  if (!user)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  await claimProductUseCase.execute(user, id);

  return NextResponse.json({ message: 'Success' }, { status: 200 });
}
