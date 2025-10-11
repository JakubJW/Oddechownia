import { db } from '@/db';
import { comments } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { NextResponse, NextRequest } from 'next/server';
import { Params } from '@/types/types';

export async function GET(
  req: NextRequest,
  {
    params,
  }: { params: Params<{ id: string; page?: number; perPage?: number }> }
) {
  try {
    const { id, page, perPage } = await params;

    const replies = await db.query.comments.findMany({
      with: {
        replies: { columns: { id: true } },
        user: { columns: { firstName: true, lastName: true } },
      },
      where: eq(comments.parentId, parseInt(id)),
      orderBy: desc(comments.createdAt),
      ...{ limit: perPage ? perPage : undefined },
      ...{ offset: page && perPage ? (page - 1) * perPage : undefined },
    });

    const formattedReplies = replies.map((r) => ({
      ...r,
      user: { name: `${r.user.firstName} ${r.user.lastName}` },
      replyCount: r.replies.length,
    }));

    return NextResponse.json(
      { data: formattedReplies, message: 'Success!' },
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
