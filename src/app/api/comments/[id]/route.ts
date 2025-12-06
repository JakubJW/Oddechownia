import { NextRequest, NextResponse } from 'next/server';
import { Params } from '@/types/types';
import { CommentsService } from '@/server/services/comments.service';
import { craeteCommentFormSchema } from '@/features/PlayLessonView/Comments/Form/schema';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Params<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const [result] = await CommentsService.updateComment(
      Number(id),
      parsed.data
    );

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Params<{ id: string }> }
) {
  try {
    const { id } = await params;

    await CommentsService.removeComment(Number(id));

    return NextResponse.json({ message: 'Success!' }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
