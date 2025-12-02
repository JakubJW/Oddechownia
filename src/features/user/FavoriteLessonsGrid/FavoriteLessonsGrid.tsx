'use client';

import LessonCard from '@/components/LessonCard/LessonCard';
import LessonGrid from '@/features/admin/Lesson/LessonGrid';
import { Button } from '@/components/ui/button';
import { useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
import React from 'react';
import { FetchFavoriteLessonsResponse } from '@/server/models/lesson.models';

const FavoriteLessonsGrid = () => {
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
    return <p>Ładowanie...</p>;
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
      <div className="p-4 text-center">
        <p className="text-gray-500">
          Nie masz jeszcze żadnych ulubionych lekcji
        </p>
      </div>
    );
  }

  return (
    <div>
      <LessonGrid>
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
      </LessonGrid>

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
