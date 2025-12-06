import { getUser } from '@/server/actions/user';
import { db } from '@/server/db';
import { posts } from '@/server/db/schema';
import { Params } from '@/types/types';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { createPostFormSchema } from '@/features/Spolecznosc/createPostFormSchema';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Params<{ id: string }> }
) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!user.isAdmin) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = createPostFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Błąd walidacji danych' },
        { status: 400 }
      );
    }

    await db
      .update(posts)
      .set({ ...parsed.data })
      .where(eq(posts.id, Number(id)));

    return NextResponse.json(
      { message: 'Pomyślnie edytowano post' },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Błąd' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Params<{ id: string }> }
) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await db.delete(posts).where(eq(posts.id, Number(id)));

    return NextResponse.json({ message: 'Usunięto post' }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Błąd' }, { status: 500 });
  }
}
