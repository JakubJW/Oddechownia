import { Params } from '@/types/types';
import { NextRequest, NextResponse } from 'next/server';
import { and, eq, desc, isNull, lt } from 'drizzle-orm';
import { comments } from '@/db/schema';
import { db } from '@/db';
import { encodeCursor, decodeCursor } from '@/lib/utils';

const getQueryParams = (url: string) => {
  return Object.fromEntries(new URL(url).searchParams);
};

export async function GET(
  req: NextRequest,
  { params }: { params: Params<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    const searchParams = getQueryParams(req.url);

    const cursor = decodeCursor(searchParams.cursor);
    const perPage = 3;

    const lessonComments = await db.query.comments.findMany({
      where: and(
        eq(comments.lessonId, Number(lessonId)),
        isNull(comments.parentId),
        cursor ? lt(comments.createdAt, String(cursor)) : undefined
      ),
      orderBy: desc(comments.createdAt),
      with: {
        replies: { columns: { id: true } },
        user: { columns: { firstName: true, lastName: true } },
      },
      limit: perPage,
    });

    const formattedComments = lessonComments.map((c) => ({
      ...c,
      user: { name: `${c.user.firstName} ${c.user.lastName}` },
      replyCount: c.replies.length,
    }));

    return NextResponse.json({
      data: {
        data: formattedComments,
        nextCursor:
          formattedComments.length === perPage
            ? encodeCursor(
                formattedComments[formattedComments.length - 1].createdAt
              )
            : null,
      },
      success: true,
      error: null,
    });
  } catch (error) {
    console.error(
      'Podczas ładowania komentarzy wystąpił błąd. Spróbuj ponownie później.',
      error
    );

    return NextResponse.json({
      data: null,
      success: false,
      error:
        'Podczas ładowania komentarzy wystąpił błąd. Spróbuj ponownie później.',
    });
  }
}
