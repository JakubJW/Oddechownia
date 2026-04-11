import { Params } from '@/types/types';
import { NextRequest, NextResponse } from 'next/server';
import { ClaimProductRegisteredUseCase } from '@/application/use-cases/product/claim-product-registered.use-case';
import { UserService } from '@/infrastructure/services/user.service';
import { ProductsRepository } from '@/infrastructure/repositories/products.repository';
import { PurchasesRepository } from '@/infrastructure/repositories/purchases.repository';
import { SubscriptionRepository } from '@/infrastructure/repositories/subscription.repository';
import { ClaimLiveLessonGuestUseCase } from '@/application/use-cases/product/claim-live-lesson-guest.use-case';
import { liveLessonSignUpFormSchema } from '@/features/LiveLesson/Form/schema';
import { LiveLessonsRepository } from '@/infrastructure/repositories/live-lessons.repository';
import { AppError } from '@/server/lib/errors';

export async function POST(
  req: NextRequest,
  { params }: { params: Params<{ id: string }> }
) {
  const { id } = await params;

  const userService = new UserService();
  const user = await userService.getUser();

  if (!user) {
    const body = await req.json();
    const parsed = liveLessonSignUpFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Błąd walidacji danych' },
        { status: 400 }
      );
    }

    try {
      const useCase = new ClaimLiveLessonGuestUseCase(
        new PurchasesRepository(),
        new LiveLessonsRepository()
      );

      const result = await useCase.execute(parsed.data.email, id);

      return NextResponse.json(result, { status: 200 });
    } catch (error) {
      console.log(error);

      if (error instanceof AppError) {
        return NextResponse.json(error.userMessage, { status: error.status });
      } else {
        return NextResponse.json({ error: error }, { status: 500 });
      }
    }
  } else {
    try {
      const useCase = new ClaimProductRegisteredUseCase(
        new ProductsRepository(),
        new PurchasesRepository(),
        new SubscriptionRepository()
      );

      const result = await useCase.execute(user, id);

      return NextResponse.json(result, { status: 200 });
    } catch (error) {
      if (error instanceof AppError) {
        return NextResponse.json(error.userMessage, { status: error.status });
      }
    }
  }
}
