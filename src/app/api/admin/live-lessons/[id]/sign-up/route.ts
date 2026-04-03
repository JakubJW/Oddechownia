import { NextRequest, NextResponse } from 'next/server';
import { liveLessonSignUpFormSchema } from '@/features/LiveLesson/Form/schema';
import { logger } from '@/server/lib/logger.service';
import { getUser } from '@/server/actions/user';
import { LiveLessonsRegistrationsService } from '@/server/services/liveLessonsRegistrations.service';
import { AppError } from '@/server/lib/errors';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const log = logger.child({ module: 'live-lessons-registrations' });

  try {
    const { id } = await params;
    const user = await getUser();
    const values = await req.json();

    const parsed = liveLessonSignUpFormSchema.safeParse(values);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Validation error' },
        { status: 400 }
      );
    }

    const result = await LiveLessonsRegistrationsService.create(
      id,
      parsed.data,
      user
    );

    return NextResponse.json(
      { message: 'Success!', data: { url: result?.sessionUrl } },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof AppError) {
      log.info(
        {
          httpStatus: error.status,
          message: error.message,
        },
        `Expected API failure: ${error.name}`
      );

      return NextResponse.json(
        { message: error.userMessage },
        { status: error.status }
      );
    }

    log.error(
      {
        operation: 'signUp',
        httpStatus: 500,
        error:
          error instanceof Error
            ? { message: error.message, stack: error.stack }
            : error,
      },
      'Unexpected API failure.'
    );

    return NextResponse.json(
      { message: 'Podczas zapisu na wystąpił błąd.' },
      { status: 500 }
    );
  }
}
