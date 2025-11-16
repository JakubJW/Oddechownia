import { NextRequest, NextResponse } from 'next/server';
import { LiveLessonsService } from '@/server/services/liveLessons.service';
import { decodeCursor } from '@/lib/utils';
import { getUser } from '@/server/actions/user';
import { AppError, AuthenticationError } from '@/server/lib/errors';
import { logger } from '@/server/lib/logger.service';

const getQueryParams = (url: string) => {
  return Object.fromEntries(new URL(url).searchParams);
};

export async function GET(req: NextRequest) {
  const log = logger.child({ module: 'user-live-lessons' });

  try {
    const user = await getUser();

    if (!user) {
      throw new AuthenticationError(
        'Get user live lessons (user not logged in).',
        'Aby uzyskać dostęp, zaloguj się.'
      );
    }

    const searchParams = getQueryParams(req.url);

    const cursor = decodeCursor(searchParams.cursor);
    const perPage = 3;

    const result = await LiveLessonsService.getUserLessons(user);

    return NextResponse.json({
      data: {
        data: result,
        nextCursor: null,
      },
      success: true,
      error: null,
    });
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
        operation: 'getUserLiveLessons',
        httpStatus: 500,
        error:
          error instanceof Error
            ? { message: error.message, stack: error.stack }
            : error,
      },
      'Unexpected API failure.'
    );

    return NextResponse.json(
      { message: 'Podczas pobierania zajęć na żywo wystąpił błąd.' },
      { status: 500 }
    );
  }
}
