import { CommentDetailDTO } from '../models/comment.models';
import { eq, desc, isNull, and, InferSelectModel, lt } from 'drizzle-orm';
import { db } from '../db';
import { comments, users } from '../db/schema';
import { getUser } from '../actions/user';
import { formSchema } from '@/features/Lesson/Comments/Form/schema';
import z from 'zod';

type CommentWithRepliesAndUser = InferSelectModel<typeof comments> & {
  user: Pick<
    InferSelectModel<typeof users>,
    'firstName' | 'lastName' | 'role' | 'id'
  >;
  replies: Pick<InferSelectModel<typeof comments>, 'id'>[];
};

const transformToCommentDetailDto = (
  comments: CommentWithRepliesAndUser[],
  userId: string
): CommentDetailDTO[] => {
  return comments.map(({ user, replies, ...rest }) => ({
    ...rest,
    parentId: rest.parentId ?? undefined,
    author: `${user.firstName} ${user.lastName}`,
    replyCount: replies.length,
    isAdmin: user.role === 'admin',
    isAuthor: user.id === userId,
  }));
};

const createComment = async (
  lessonId: number,
  values: z.infer<typeof formSchema>
) => {
  const user = await getUser();

  if (!user) throw new Error('Authentication error');

  const [inserted] = await db
    .insert(comments)
    .values({ ...values, lessonId, userId: user.id })
    .returning();

  const result = await db.query.comments.findMany({
    with: {
      replies: { columns: { id: true } },
      user: {
        columns: { firstName: true, lastName: true, role: true, id: true },
      },
    },
    where: eq(comments.id, inserted.id),
  });

  return transformToCommentDetailDto(result, user.id);
};

const removeComment = async (id: number) => {
  await db.delete(comments).where(eq(comments.id, id));
};

const getComments = async (
  lessonId: number,
  cursor: string | null,
  perPage: number = 3
) => {
  const result = await db.query.comments.findMany({
    with: {
      replies: { columns: { id: true } },
      user: {
        columns: { firstName: true, lastName: true, role: true, id: true },
      },
    },
    where: and(
      eq(comments.lessonId, lessonId),
      isNull(comments.parentId),
      cursor ? lt(comments.createdAt, cursor) : undefined
    ),
    orderBy: desc(comments.createdAt),
    limit: perPage,
  });

  const user = await getUser();

  if (!user) throw new Error('Authentication error');

  return transformToCommentDetailDto(result, user.id);
};

const getReplies = async (
  parentId: number,
  cursor: string | null,
  perPage: number = 3
) => {
  const result = await db.query.comments.findMany({
    with: {
      replies: { columns: { id: true } },
      user: {
        columns: { firstName: true, lastName: true, role: true, id: true },
      },
    },
    where: and(
      eq(comments.parentId, parentId),
      cursor ? lt(comments.createdAt, cursor) : undefined
    ),
    orderBy: desc(comments.createdAt),
    limit: perPage,
  });

  const user = await getUser();

  if (!user) throw new Error('Authentication error');

  return transformToCommentDetailDto(result, user.id);
};

export const CommentsService = {
  getComments,
  getReplies,
  createComment,
  removeComment,
};
