import { UserLiveLessonCard } from '@/entities/models/live-lesson';
import { useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';

export const useUserLiveLessons = () => {
  const liveLessonsAPI = async ({
    pageParam,
  }: {
    pageParam: string | null;
  }) => {
    const res = await fetch(`/api/user-live-lessons?cursor=${pageParam}`, {
      method: 'GET',
    });

    if (!res.ok) {
      const errorBody = (await res.json()) as { message: string };

      throw new Error(errorBody.message || 'Unknown error');
    }

    const json = await res.json();
    return json.data as {
      data: UserLiveLessonCard[];
      nextCursor: string | null;
      success: boolean;
      error: string | null;
    };
  };

  return useInfiniteQuery({
    queryKey: ['live-lessons'],
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    placeholderData: keepPreviousData,
    queryFn: liveLessonsAPI,
  });
};
