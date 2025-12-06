import { NextRequest, NextResponse } from 'next/server';
import { CommentsService } from '@/server/services/comments.service';
import { encodeCursor, decodeCursor } from '@/lib/utils';
import { craeteCommentFormSchema } from '@/features/PlayLessonView/Comments/Form/schema';

const getQueryParams = (url: string) => {
  return Object.fromEntries(new URL(url).searchParams);
};

export async function GET(req: NextRequest) {
  try {
    const searchParams = getQueryParams(req.url);

    const lessonId = searchParams.lessonId;
    const postId = searchParams.postId;
    const cursor = decodeCursor(searchParams.cursor);

    const targets = [lessonId, postId].filter(Boolean);

    if (!targets.length) {
      return NextResponse.json(
        { message: 'Podczas pobierania komentarzy wystąpił błąd.' },
        { status: 400 }
      );
    }

    const perPage = 3;
    const result = await CommentsService.getComments(
      {
        postId: postId ? Number(postId) : undefined,
        lessonId: lessonId ? Number(lessonId) : undefined,
      },
      String(cursor),
      perPage
    );

    return NextResponse.json({
      data: result,
      nextCursor:
        result.length === perPage
          ? encodeCursor(result[result.length - 1].createdAt)
          : null,
    });
  } catch (error) {
    console.error(
      'Podczas ładowania komentarzy wystąpił błąd. Spróbuj ponownie później.',
      error
    );

    return NextResponse.json(
      {
        data: null,
        success: false,
        error:
          'Podczas ładowania komentarzy wystąpił błąd. Spróbuj ponownie później.',
      },
      { status: 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = craeteCommentFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          data: null,
          success: false,
          error: 'Bad request',
        },
        { status: 400 }
      );
    }

    const [result] = await CommentsService.createComment(parsed.data);

    return NextResponse.json({
      data: result,
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
