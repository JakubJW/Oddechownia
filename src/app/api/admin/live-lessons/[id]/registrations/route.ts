import { GetLiveLessonPurchasesListUseCase } from '@/application/use-cases/live-lesson/get-live-lesson-purchases-list.use-case';
import { LiveLessonsRepository } from '@/infrastructure/repositories/live-lessons.repository';
import { PurchasesRepository } from '@/infrastructure/repositories/purchases.repository';
import { AppError } from '@/server/lib/errors';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const useCase = new GetLiveLessonPurchasesListUseCase(
      new PurchasesRepository(),
      new LiveLessonsRepository()
    );

    const result = await useCase.execute(id);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return NextResponse.json(
        { message: error.userMessage },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
