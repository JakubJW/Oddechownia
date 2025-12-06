import { InferSelectModel } from 'drizzle-orm';
import { comments } from '../db/schema';

export type CommentSchema = InferSelectModel<typeof comments>;
export type CommentBaseDTO = Omit<
  CommentSchema,
  'parentId' | 'userId' | 'postId' | 'lessonId'
>;
export type CommentDTO = CommentBaseDTO & {
  parentId?: number;
  postId?: number;
  lessonId?: number;
};
export type CommentDetailDTO = CommentDTO & {
  author: string;
  isAdmin: boolean;
  isAuthor: boolean;
  replyCount?: number;
};

export type FetchCommentsResponse = {
  data: CommentDetailDTO[];
  nextCursor: string | null;
};
