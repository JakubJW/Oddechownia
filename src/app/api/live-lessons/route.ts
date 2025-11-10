import { NextRequest, NextResponse } from 'next/server';
import { LiveLessonsService } from '@/server/services/liveLessons.service';
import { encodeCursor, decodeCursor } from '@/lib/utils';

const getQueryParams = (url: string) => {
  return Object.fromEntries(new URL(url).searchParams);
};

export async function GET(req: NextRequest) {
  try {
    const searchParams = getQueryParams(req.url);

    const cursor = decodeCursor(searchParams.cursor);
    const perPage = 3;

    const result = await LiveLessonsService.getMany(String(cursor), perPage);

    return NextResponse.json({
      data: {
        data: result,
        nextCursor: null,
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
