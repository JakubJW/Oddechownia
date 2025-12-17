import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/server/actions/user';
import { LessonsService } from '@/server/services/lessons.service';
import { decodeCursor, encodeCursor } from '@/lib/utils';

const getQueryParams = (url: string) => {
  return Object.fromEntries(new URL(url).searchParams);
};

export async function GET(req: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = getQueryParams(req.url);
    const cursor = decodeCursor(searchParams.cursor);
    const perPage = 8;

    const result = await LessonsService.getUserFavoriteLessons(
      user.id,
      String(cursor),
      perPage
    );

    return NextResponse.json({
      data: {
        data: result,
        nextCursor:
          result.length === perPage
            ? encodeCursor(result[result.length - 1].createdAt)
            : null,
      },
      success: true,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
