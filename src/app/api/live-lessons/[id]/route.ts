import { NextRequest, NextResponse } from 'next/server';
import { LiveLessonsService } from '@/server/services/liveLessons.service';
import { logger } from '@/server/lib/logger.service';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const log = logger.child({ module: 'live-lessons' });

  try {
    const values = await req.json();
    const { id } = await params;

    await LiveLessonsService.update(id, values);

    return NextResponse.json({ message: 'Success!' }, { status: 200 });
  } catch (error) {
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
