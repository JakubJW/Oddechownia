import { NextRequest, NextResponse } from 'next/server';
import { LiveLessonsService } from '@/server/services/liveLessons.service';
import { createformSchema } from '@/features/admin/LiveLesson/Form/schema';
import { logger } from '@/server/lib/logger.service';

export async function POST(req: NextRequest) {
  const log = logger.child({ module: 'live-lessons' });

  try {
    const values = await req.json();

    const parsed = createformSchema.safeParse(values);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Validation error' },
        { status: 400 }
      );
    }

    await LiveLessonsService.create(parsed.data);

    return NextResponse.json({ message: 'Success!' }, { status: 200 });
  } catch (error) {
    log.error(
      {
        operation: 'create',
        httpStatus: 500,
        error:
          error instanceof Error
            ? { message: error.message, stack: error.stack }
            : error,
      },
      'Podczas tworzenia zajęć na żywo wystąpił błąd.'
    );

    return NextResponse.json(
      { message: 'Podczas tworzenia zajęć na żywo wystąpił błąd.' },
      { status: 500 }
    );
  }
}
