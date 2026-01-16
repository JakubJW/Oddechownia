import { NextRequest, NextResponse } from 'next/server';
import { LiveLessonsService } from '@/server/services/liveLessons.service';
import { decodeCursor, encodeCursor } from '@/lib/utils';

const getQueryParams = (url: string) => {
  return Object.fromEntries(new URL(url).searchParams);
};

export async function GET(req: NextRequest) {
  try {
    const searchParams = getQueryParams(req.url);

    const cursor = decodeCursor(searchParams.cursor);
    const perPage = 8;

    const result = await LiveLessonsService.getMany(cursor, perPage);

    return NextResponse.json({
      data: {
        data: result,
        nextCursor:
          result.length === perPage
            ? encodeCursor(result[result.length - 1].scheduledAt)
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
