import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import {
  CommentDetailDTO,
  FetchCommentsResponse,
} from '@/server/models/comment.models';

export const useComments = ({
  entity,
  entityId,
  initialData,
}: {
  entity: 'post' | 'lesson';
  entityId: number;
  initialData?: CommentDetailDTO[];
}) => {
  const fetchCommentsAPI = async ({
    pageParam,
  }: {
    pageParam: string | null;
  }) => {
    const res = await fetch(
      `/api/comments?${entity === 'lesson' ? 'lessonId=' : 'postId='}${entityId}&cursor=${pageParam}`
    );

    if (!res.ok) {
      const errorBody = await res
        .json()
        .catch(() => ({ message: res.statusText }));

      throw new Error(
        `Failed to fetch comments (Status ${res.status}): ${
          errorBody.message || 'Unknown error'
        }`
      );
    }

    const json = await res.json();
    return json as FetchCommentsResponse;
  };

  const queryComments = useInfiniteQuery({
    queryKey: ['comments', entityId],
    initialPageParam: null,
    getNextPageParam: ({ nextCursor }) => nextCursor,
    placeholderData: keepPreviousData,
    queryFn: fetchCommentsAPI,
    initialData: initialData
      ? {
          pages: [
            {
              data: initialData,
              nextCursor: 'seasdasds',
            },
          ],
          pageParams: [null],
        }
      : undefined,
  });

  return {
    queryComments,
  };
};
