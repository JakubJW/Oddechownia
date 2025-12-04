import { NextResponse, NextRequest } from 'next/server';
import { getUser } from '@/server/actions/user';
import { createPostFormSchema } from '@/features/Spolecznosc/createPostFormSchema';
import { db } from '@/server/db';
import { posts } from '@/server/db/schema';
import { asc, desc, lt } from 'drizzle-orm';
import { createSlug, decodeCursor, encodeCursor } from '@/lib/utils';

const getQueryParams = (url: string) => {
  return Object.fromEntries(new URL(url).searchParams);
};

export async function GET(req: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!user.hasActiveSubscription) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const searchParams = getQueryParams(req.url);
    const cursor = decodeCursor(searchParams.cursor);

    const result = await db.query.posts.findMany({
      with: {
        comments: { columns: { id: true, createdAt: true } },
        author: { columns: { firstName: true, lastName: true } },
      },
      where: cursor ? lt(posts.createdAt, cursor) : undefined,
      orderBy: desc(posts.createdAt),
      limit: 8,
    });

    return NextResponse.json(
      {
        data: {
          data: result,
          nextCursor:
            result.length === 3
              ? encodeCursor(result[result.length - 1].createdAt)
              : null,
        },
        success: true,
        error: null,
      },
      { status: 200 }
    );
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
    const parsed = createPostFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Błąd walidacji danych' },
        { status: 400 }
      );
    }

    await db.insert(posts).values({
      ...parsed.data,
      authorId: user.id,
      slug: createSlug(parsed.data.title),
    });

    return NextResponse.json({ message: 'Post opublikowany' }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Błąd' }, { status: 500 });
  }
}
