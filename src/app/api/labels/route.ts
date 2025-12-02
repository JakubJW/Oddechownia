import { NextResponse, NextRequest } from 'next/server';
import { getUser } from '@/server/actions/user';
import { createLabelFormSchema } from '@/features/admin/Labels/createLabelFormSchema';
import { db } from '@/server/db';
import { labels } from '@/server/db/schema';
import { asc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    // const user = await getUser();

    // if (!user) {
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    // }

    // if (!user.isAdmin) {
    //   return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    // }

    const result = await db.query.labels.findMany({
      orderBy: asc(labels.text),
    });

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Błąd' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!user.isAdmin) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = createLabelFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Błąd walidacji danych' },
        { status: 400 }
      );
    }

    await db.insert(labels).values({ ...parsed.data });

    return NextResponse.json({ message: 'Utwrzono etykietę' }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Błąd' }, { status: 500 });
  }
}
