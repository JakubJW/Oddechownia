import { NextRequest, NextResponse } from 'next/server';
import { updateLesson } from '@/server/actions/lesson';
import { Params } from '@/types/types';
import { updateFormSchema } from '@/features/admin/Lesson/Form/schema';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Params<{ id: string }> }
) {
  const { id } = await params;
  const json = await req.json();
  const parsed = updateFormSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ message: 'Bad request' }, { status: 400 });
  }

  const lesson = await updateLesson(Number(id), parsed.data);

  return NextResponse.json(
    {
      ...lesson,
    },
    { status: 200 }
  );
}
