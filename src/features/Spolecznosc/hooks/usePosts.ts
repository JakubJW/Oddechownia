import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { FetchPostsResponse } from '@/server/models/post.models';

const getPostsAPI = async ({ pageParam }: { pageParam: string | null }) => {
  const res = await fetch(`/api/posts?cursor=${pageParam}`, {
    method: 'GET',
  });

  if (!res.ok) {
    const errorBody = await res
      .json()
      .catch(() => ({ message: res.statusText }));

    throw new Error(errorBody.message || 'Unknown error');
  }

  const json = await res.json();
  return json as FetchPostsResponse;
};

export const usePosts = () => {
  const queryPosts = useInfiniteQuery({
    queryKey: ['posts'],
    initialPageParam: null,
    getNextPageParam: ({ nextCursor }) => nextCursor,
    placeholderData: keepPreviousData,
    queryFn: getPostsAPI,
  });

  return { queryPosts };
};
