import { NextRequest, NextResponse } from 'next/server';
import { decodeCursor, encodeCursor } from '@/lib/utils';
import { createformSchema } from '@/features/admin/LiveLesson/Form/schema';
import { CreateLiveLessonUseCase } from '@/application/use-cases/live-lesson/create-live-lesson.use-case';
import { LiveLessonsRepository } from '@/infrastructure/repositories/live-lessons.repository';
import { GetAdminLiveLessonsList } from '@/application/use-cases/live-lesson/get-admin-live-lessons-list.use-case';

const getQueryParams = (url: string) => {
  return Object.fromEntries(new URL(url).searchParams);
};

export async function GET(req: NextRequest) {
  try {
    const searchParams = getQueryParams(req.url);

    const cursor = decodeCursor(searchParams.cursor);
    const perPage = 8;

    const useCase = new GetAdminLiveLessonsList(new LiveLessonsRepository());
    const result = await useCase.execute(cursor);

    return NextResponse.json({
      data: result,
      nextCursor:
        result.length === perPage
          ? encodeCursor(result[result.length - 1].scheduledAt)
          : null,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const values = await req.json();

    const parsed = createformSchema.safeParse(values);

    if (!parsed.success) {
      return NextResponse.json({ message: 'Bad request' }, { status: 400 });
    }

    const useCase = new CreateLiveLessonUseCase(new LiveLessonsRepository());
    await useCase.execute(parsed.data);

    return NextResponse.json({ status: 201 });
  } catch (error) {
    // log.error(
    //   {
    //     operation: 'create',
    //     httpStatus: 500,
    //     error:
    //       error instanceof Error
    //         ? { message: error.message, stack: error.stack }
    //         : error,
    //   },
    //   'Podczas tworzenia zajęć na żywo wystąpił błąd.'
    // );

    return NextResponse.json(
      { message: 'Podczas tworzenia zajęć na żywo wystąpił błąd.' },
      { status: 500 }
    );
  }
}
