'use client';

import { Button } from '@/components/ui/button';
import { Comment } from '@/features/Lesson/Comments/Comment';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';
import { FetchCommentsResponse } from '@/server/models/comment.models';

interface CommentsProps {
  lessonId: number;
}

export const Comments = ({ lessonId }: CommentsProps) => {
  const fetchComments = async ({ pageParam }: { pageParam: string | null }) => {
    const res = await fetch(`/api/comments/${lessonId}?cursor=${pageParam}`);
    const json = await res.json();

    return json.data as FetchCommentsResponse;
  };

  const { data, error, fetchNextPage, hasNextPage, isFetching, isPending } =
    useInfiniteQuery({
      queryKey: ['comments', lessonId],
      initialPageParam: null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      placeholderData: keepPreviousData,
      queryFn: fetchComments,
    });

  if (isPending) {
    return <p>Ładowanie</p>;
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p>Podczas ładowania komentarzy wystąpił błąd.</p>
      </div>
    );
  }

  if (!data.pages[0].data.length) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">
          Pod tą lekcją nie ma jeszcze żadnych komentarzy.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.data.map(
            ({ id, createdAt, content, author, replyCount, isAuthor }) => (
              <div
                key={id}
                className="bg-white p-4 rounded-md border "
              >
                <Comment
                  id={id}
                  author={author}
                  content={content}
                  createdAt={new Date(createdAt)}
                  isAuthor={isAuthor}
                  lessonId={lessonId}
                  replyCount={replyCount}
                />
              </div>
            )
          )}
        </React.Fragment>
      ))}

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
