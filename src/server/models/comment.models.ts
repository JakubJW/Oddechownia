import { InferSelectModel } from 'drizzle-orm';
import { comments } from '../db/schema';

export type CommentSchema = InferSelectModel<typeof comments>;
export type CommentBaseDTO = Omit<CommentSchema, 'parentId'>;
export type CommentDTO = CommentBaseDTO & { parentId?: number };
export type CommentDetailDTO = CommentDTO & {
  author: string;
  isAdmin: boolean;
  isAuthor: boolean;
  replyCount: number;
};

export type FetchCommentsResponse = {
  data: CommentDetailDTO[];
  nextCursor: string | null;
  success: boolean;
  error: string | null;
};
