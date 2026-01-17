'use client';

import LessonCard from '@/components/LessonCard/LessonCard';
import { Button } from '@/components/ui/button';
import { useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
import React from 'react';
import { FetchFavoriteLessonsResponse } from '@/server/models/lesson.models';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';

const FavoriteLessonsGrid = () => {
  const router = useRouter();
  const fetchFavoriteLessons = async ({
    pageParam,
  }: {
    pageParam: string | null;
  }) => {
    const res = await fetch(`/api/lessons/favorite?cursor=${pageParam}`);

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
    return json.data as FetchFavoriteLessonsResponse;
  };

  const { data, isError, fetchNextPage, hasNextPage, isFetching, isPending } =
    useInfiniteQuery({
      queryKey: ['favoriteLessons'],
      refetchOnMount: true,
      initialPageParam: null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      placeholderData: keepPreviousData,
      queryFn: fetchFavoriteLessons,
    });

  if (isPending) {
    return (
      <div className="flex flex-col justify-center items-center  h-full space-y-4 text-center">
        <span className="flex gap-2 text-gray-500">
          Ładowanie <Loader2 className="animate-spin" />
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center">
        <p>Podczas ładowania ulubionych lekcji wystąpił błąd.</p>
      </div>
    );
  }

  if (data.pages.every((page) => !page.data.length)) {
    return (
      <div className="flex flex-col justify-center items-center  space-y-4 text-center">
        <p className="text-gray-500">
          Nie masz jeszcze żadnych ulubionych lekcji.
        </p>
        <Button onClick={() => router.push('/studio-jogi-online')}>
          Zobacz lekcje <ArrowRight className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-8">
        {data?.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.data.map(
              ({
                id,
                name,
                description,
                video,
                slug,
                thumbnail,
                playlists,
                labels,
              }) => (
                <a
                  href={`/studio-jogi-online/${playlists[0].slug}/${slug}`}
                  key={id}
                  className="hover:opacity-80"
                >
                  <LessonCard
                    thumbnail={thumbnail}
                    name={name}
                    video={video}
                    description={description}
                    labels={labels}
                  />
                </a>
              )
            )}
          </React.Fragment>
        ))}
      </div>

      {hasNextPage && (
        <Button
          disabled={isFetching}
          onClick={() => fetchNextPage()}
        >
          {isFetching ? 'Ładowanie...' : 'Pokaż więcej'}
        </Button>
      )}
    </div>
  );
};

export default FavoriteLessonsGrid;
