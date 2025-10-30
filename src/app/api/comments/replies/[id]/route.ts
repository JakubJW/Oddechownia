import { NextResponse, NextRequest } from 'next/server';
import { Params } from '@/types/types';
import { CommentsService } from '@/server/services/comments.service';
import { decodeCursor, encodeCursor } from '@/lib/utils';

const getQueryParams = (url: string) => {
  return Object.fromEntries(new URL(url).searchParams);
};

export async function GET(
  req: NextRequest,
  { params }: { params: Params<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = getQueryParams(req.url);

    const cursor = decodeCursor(searchParams.cursor);
    const perPage = 3;
    const result = await CommentsService.getReplies(
      Number(id),
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
