import { CommentDetailDTO } from '../models/comment.models';
import { eq, desc, isNull, and, InferSelectModel, lt } from 'drizzle-orm';
import { db } from '../db';
import { comments, users } from '../db/schema';
import { getUser } from '../actions/user';
import { CreateCommentValues } from '@/features/lesson-playback/Comments/Form/schema';

type CommentWithRepliesAndUser = InferSelectModel<typeof comments> & {
  user: Pick<
    InferSelectModel<typeof users>,
    'firstName' | 'lastName' | 'role' | 'id'
  >;
  replies: Pick<InferSelectModel<typeof comments>, 'id'>[];
};

const transformToCommentDetailDto = (
  comments: CommentWithRepliesAndUser[],
  userId?: string
): CommentDetailDTO[] => {
  return comments.map(
    ({ user, replies, postId, lessonId, parentId, ...rest }) => ({
      ...rest,
      lessonId: lessonId ?? undefined,
      postId: postId ?? undefined,
      parentId: parentId ?? undefined,
      author: `${user.firstName} ${user.lastName}`,
      replyCount: replies.length,
      isAdmin: user.role === 'admin',
      isAuthor: user.id === userId,
    })
  );
};

const createComment = async (values: CreateCommentValues) => {
  const user = await getUser();

  if (!user) throw new Error('Authentication error');

  const [inserted] = await db
    .insert(comments)
    .values({ ...values, userId: user.id })
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

const updateComment = async (id: number, values: CreateCommentValues) => {
  const user = await getUser();

  if (!user) throw new Error('Authentication error');

  const [updated] = await db
    .update(comments)
    .set({ ...values })
    .where(eq(comments.id, id))
    .returning();

  const result = await db.query.comments.findMany({
    with: {
      replies: { columns: { id: true } },
      user: {
        columns: { firstName: true, lastName: true, role: true, id: true },
      },
    },
    where: eq(comments.id, updated.id),
  });

  return transformToCommentDetailDto(result, user.id);
};

const removeComment = async (id: number) => {
  await db.delete(comments).where(eq(comments.id, id));
};

const getComments = async (
  { postId, lessonId }: { postId?: number; lessonId?: number },
  cursor: string | null,
  perPage: number = 3
) => {
  let condition = undefined;
  let cursorCondition = undefined;

  if (postId) {
    condition = eq(comments.postId, postId);
  }

  if (lessonId) {
    condition = eq(comments.lessonId, lessonId);
  }

  if (cursor) {
    cursorCondition = lt(comments.createdAt, cursor);
  }

  const result = await db.query.comments.findMany({
    with: {
      replies: { columns: { id: true } },
      user: {
        columns: { firstName: true, lastName: true, role: true, id: true },
      },
    },
    where: and(condition, cursorCondition, isNull(comments.parentId)),
    orderBy: desc(comments.createdAt),
    limit: perPage,
  });

  const user = await getUser();

  return transformToCommentDetailDto(result, user?.id);
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

  return transformToCommentDetailDto(result, user?.id);
};

export const CommentsService = {
  getComments,
  getReplies,
  createComment,
  updateComment,
  removeComment,
};
