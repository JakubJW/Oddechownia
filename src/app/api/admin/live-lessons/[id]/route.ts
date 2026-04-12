import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/server/lib/logger.service';
import { NotFoundError } from '@/server/lib/errors';
import { UpdateLiveLessonUseCase } from '@/application/use-cases/live-lesson/update-live-lesson.use-case';
import { LiveLessonsRepository } from '@/infrastructure/repositories/live-lessons.repository';
import { updateFormSchema } from '@/features/admin/LiveLesson/Form/schema';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const log = logger.child({ module: 'live-lessons' });

  try {
    const values = await req.json();
    const { id } = await params;

    const parsed = updateFormSchema.safeParse(values);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Bad request', errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const useCase = new UpdateLiveLessonUseCase(new LiveLessonsRepository());
    await useCase.execute(id, values);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    log.error(
      {
        operation: 'update',
        httpStatus: 500,
        error:
          error instanceof Error
            ? { message: error.message, stack: error.stack }
            : error,
      },
      'Podczas edycji zajęć na żywo wystąpił błąd.'
    );

    return NextResponse.json(
      { message: 'Podczas edycji zajęć na żywo wystąpił błąd.' },
      { status: 500 }
    );
  }
}
