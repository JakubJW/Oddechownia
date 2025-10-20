import { Params } from '@/types/types';
import { NextRequest, NextResponse } from 'next/server';
import { CommentsService } from '@/server/services/comments.service';
import { encodeCursor, decodeCursor } from '@/lib/utils';
import { formSchema } from '@/features/Lesson/Comments/Form/schema';

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

    const result = await CommentsService.getComments(
      Number(lessonId),
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

export async function POST(
  req: NextRequest,
  { params }: { params: Params<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    const body = await req.json();

    const parsed = formSchema.safeParse(body);

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

    const [result] = await CommentsService.createComment(
      Number(lessonId),
      parsed.data
    );

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
