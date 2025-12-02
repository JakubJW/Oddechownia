import { createLabelFormSchema } from '@/features/admin/Labels/createLabelFormSchema';
import { getUser } from '@/server/actions/user';
import { db } from '@/server/db';
import { labels } from '@/server/db/schema';
import { Params } from '@/types/types';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

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
    const parsed = createLabelFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Błąd walidacji danych' },
        { status: 400 }
      );
    }

    await db
      .update(labels)
      .set({ ...parsed.data })
      .where(eq(labels.id, Number(id)));

    return NextResponse.json(
      { message: 'Pomyślnie edytowano etykietę' },
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

    if (!user.isAdmin) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    await db.delete(labels).where(eq(labels.id, Number(id)));

    return NextResponse.json({ message: 'Usunięto etykietę' }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Błąd' }, { status: 500 });
  }
}
