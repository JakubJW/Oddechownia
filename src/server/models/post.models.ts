import { InferSelectModel } from 'drizzle-orm';
import { posts } from '../db/schema';
import { CommentDetailDTO } from './comment.models';

export type PostSchema = InferSelectModel<typeof posts>;
export type PostDTO = Omit<PostSchema, 'authorId'>;

export type PostDetailDTO = PostDTO & {
  author: string;
  isAdmin: boolean;
  isAuthor: boolean;
  replyCount: number;
  comments: CommentDetailDTO[];
};

export type FetchPostsResponse = {
  data: PostDetailDTO[];
  nextCursor: string | null;
};
