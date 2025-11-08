import { db } from '@/server/db';
import { userFavoriteLessons } from '@/server/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/server/actions/user';
import { and, eq } from 'drizzle-orm';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const canChangeFavoriteStatus =
      user.role === 'admin' || user.hasActiveSubscription;

    if (!canChangeFavoriteStatus) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const condition = and(
      eq(userFavoriteLessons.userId, user.id),
      eq(userFavoriteLessons.lessonId, Number(id))
    );

    const isFavorite = body.isFavorite;

    if (!isFavorite) {
      await db.delete(userFavoriteLessons).where(condition);

      return NextResponse.json(
        { message: 'Success!', data: { isFavorite: false } },
        { status: 200 }
      );
    }

    await db.insert(userFavoriteLessons).values({
      userId: user.id,
      lessonId: Number(id),
    });

    return NextResponse.json(
      { message: 'Success!', data: { isFavorite: true } },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
