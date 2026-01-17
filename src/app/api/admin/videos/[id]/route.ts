import { NextRequest, NextResponse } from 'next/server';
import { deleteVideo } from '@/server/actions/video';
import { Params } from '@/types/types';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Params<{ id: string }> }
) {
  const { id } = await params;

  await deleteVideo(id);

  return NextResponse.json(
    {
      success: true,
    },
    { status: 200 }
  );
}
