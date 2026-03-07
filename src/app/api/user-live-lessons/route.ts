import { NextRequest, NextResponse } from 'next/server';
import { decodeCursor } from '@/lib/utils';
import { AppError, AuthenticationError } from '@/server/lib/errors';
import { logger } from '@/server/lib/logger.service';
import { GetUserLiveLessons } from '@/application/use-cases/live-lesson/get-user-live-lessons.use-case';
import { PurchasesRepository } from '@/infrastructure/repositories/purchases.repository';
import { SubscriptionRepository } from '@/infrastructure/repositories/subscription.repository';
import { LiveLessonsRepository } from '@/infrastructure/repositories/live-lessons.repository';
import { UserService } from '@/infrastructure/services/user.service';

const getQueryParams = (url: string) => {
  return Object.fromEntries(new URL(url).searchParams);
};

export async function GET(req: NextRequest) {
  const log = logger.child({ module: 'user-live-lessons' });
  const userService = new UserService();

  try {
    const user = await userService.getUser();

    if (!user) {
      throw new AuthenticationError(
        'Get user live lessons (user not logged in).',
        'Aby uzyskać dostęp, zaloguj się.'
      );
    }

    const searchParams = getQueryParams(req.url);

    const cursor = decodeCursor(searchParams.cursor);
    const perPage = 3;

    const useCase = new GetUserLiveLessons(
      new PurchasesRepository(),
      new SubscriptionRepository(),
      new LiveLessonsRepository()
    );

    const result = await useCase.execute(user.id);

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
