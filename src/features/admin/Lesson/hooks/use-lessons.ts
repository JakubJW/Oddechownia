import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { FetchAdminLessonListResponse } from '@/server/models/lesson.models';

const lessonsAPI = async ({ pageParam }: { pageParam: string | null }) => {
  const res = await fetch(`/api/admin/lessons/?cursor=${pageParam}`, {
    method: 'GET',
  });

  if (!res.ok) {
    const errorBody = await res
      .json()
      .catch(() => ({ message: res.statusText }));

    throw new Error(errorBody.message || 'Unknown error');
  }

  const json = await res.json();
  return json as FetchAdminLessonListResponse;
};

export const useLessons = () => {
  return useInfiniteQuery({
    queryFn: lessonsAPI,
    queryKey: ['lessons'],
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    placeholderData: keepPreviousData,
  });
};
