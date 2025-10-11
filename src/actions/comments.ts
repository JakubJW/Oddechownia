'use server';

import { BaseComment } from '@/db/types';
import { db } from '@/db';
import { comments } from '@/db/schema';
import { ActionResult } from './types';
import { eq, desc, isNull, and } from 'drizzle-orm';
import { getRequiredUser } from '@/lib/data';

type CreateComment = Omit<
  BaseComment,
  'id' | 'updatedAt' | 'createdAt' | 'userId'
>;

export const createComment = async (
  payload: CreateComment
): Promise<ActionResult<BaseComment>> => {
  try {
    const user = await getRequiredUser();

    const [comment] = await db
      .insert(comments)
      .values({ ...payload, userId: user.id })
      .returning();

    return { data: comment, success: true, error: null };
  } catch (error) {
    console.error(
      'Podczas dodawania komentarza wystąpił błąd. Spróbuj ponownie później.',
      error
    );

    return {
      data: null,
      success: false,
      error:
        'Podczas dodawania komentarza wystąpił błąd. Spróbuj ponownie później.',
    };
  }
};

export const getCommentsByLessonId = async (
  lessonId: number
): Promise<ActionResult<BaseComment[]>> => {
  try {
    const lessonComments = await db.query.comments.findMany({
      where: and(eq(comments.lessonId, lessonId), isNull(comments.parentId)),
      orderBy: desc(comments.createdAt),
      with: {
        replies: { columns: { id: true } },
        user: { columns: { firstName: true, lastName: true } },
      },
    });

    const formattedCommets = lessonComments.map((c) => ({
      ...c,
      user: { name: `${c.user.firstName} ${c.user.lastName}` },
      replyCount: c.replies.length,
    }));

    return { data: formattedCommets, success: true, error: null };
  } catch (error) {
    console.error(
      'Podczas ładowania komentarzy wystąpił błąd. Spróbuj ponownie później.',
      error
    );

    return {
      data: null,
      success: false,
      error:
        'Podczas ładowania komentarzy wystąpił błąd. Spróbuj ponownie później.',
    };
  }
};
