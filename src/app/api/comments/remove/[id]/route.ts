import { db } from '@/db';
import { comments } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { Params } from '@/types/types';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Params<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.delete(comments).where(eq(comments.id, Number(id)));

    return NextResponse.json({ message: 'Success!' }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
