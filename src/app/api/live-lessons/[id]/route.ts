import { NextRequest, NextResponse } from 'next/server';
import { LiveLessonsService } from '@/server/services/liveLessons.service';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const values = await req.json();
    const { id } = await params;

    await LiveLessonsService.update(id, values);

    return NextResponse.json({ message: 'Success!' }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
