import { FetchAdminLiveLessonsListResponse } from '@/server/models/liveLesson.models';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

const liveLessonsAPI = async ({ pageParam }: { pageParam: string | null }) => {
  const res = await fetch(`/api/admin/live-lessons/?cursor=${pageParam}`, {
    method: 'GET',
  });

  if (!res.ok) {
    const errorBody = await res
      .json()
      .catch(() => ({ message: res.statusText }));

    throw new Error(errorBody.message || 'Unknown error');
  }

  const json = await res.json();
  return json as FetchAdminLiveLessonsListResponse;
};

export const useLiveLessons = () => {
  return useInfiniteQuery({
    queryFn: liveLessonsAPI,
    queryKey: ['live-lessons'],
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    placeholderData: keepPreviousData,
  });
};
