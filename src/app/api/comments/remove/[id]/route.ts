import { NextRequest, NextResponse } from 'next/server';
import { Params } from '@/types/types';
import { CommentsService } from '@/server/services/comments.service';

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
