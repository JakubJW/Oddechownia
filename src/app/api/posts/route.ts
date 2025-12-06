import { NextResponse, NextRequest } from 'next/server';
import { getUser } from '@/server/actions/user';
import { createPostFormSchema } from '@/features/Spolecznosc/createPostFormSchema';
import { db } from '@/server/db';
import { comments, posts } from '@/server/db/schema';
import { asc, desc, lt, sql } from 'drizzle-orm';
import { createSlug, decodeCursor, encodeCursor } from '@/lib/utils';
import { FetchPostsResponse } from '@/server/models/post.models';

const getQueryParams = (url: string) => {
  return Object.fromEntries(new URL(url).searchParams);
};

export async function GET(
  req: NextRequest
): Promise<
  NextResponse<FetchPostsResponse> | NextResponse<{ message: string }>
> {
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
        comments: {
          columns: { id: true, createdAt: true, content: true },
          with: { user: { columns: { firstName: true, lastName: true } } },
          limit: 3,
          orderBy: desc(comments.createdAt),
        },
        author: { columns: { firstName: true, lastName: true, role: true } },
      },
      where: cursor ? lt(posts.createdAt, cursor) : undefined,
      orderBy: desc(posts.createdAt),
      limit: 8,
      extras: {
        isAuthor: sql<boolean>`${posts.authorId} = ${user.id}`.as('is_author'),
      },
    });

    const transformedResult = result.map((post) => ({
      id: post.id,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      title: post.title,
      content: post.content,
      slug: post.slug,
      isAuthor: post.isAuthor,
      isAdmin: post.author.role === 'admin',
      author: `${post.author.firstName} ${post.author.lastName}`,
      comments: post.comments.map((comment) => ({
        id: comment.id,
        author: `${comment.user.firstName} ${comment.user.lastName}`,
        createdAt: comment.createdAt,
        content: comment.content,
      })),
    }));

    return NextResponse.json(
      {
        data: transformedResult,
        nextCursor:
          result.length === 3
            ? encodeCursor(result[result.length - 1].createdAt)
            : null,
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
