'use client';

import { Button } from '@/components/ui/button';
import { User } from '@/db/types';
import { Comment } from '@/features/Lesson/Comments/Comment';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';

interface CommentsProps {
  lessonId: number;
  user: User | null;
}

export const Comments = ({ lessonId, user }: CommentsProps) => {
  const fetchComments = async ({ pageParam }: { pageParam: string | null }) => {
    const res = await fetch(`/api/comments/${lessonId}?cursor=${pageParam}`);
    const json = await res.json();

    return json.data;
  };

  const { data, error, fetchNextPage, hasNextPage, isFetching, isPending } =
    useInfiniteQuery({
      queryKey: ['comments', lessonId],
      initialPageParam: null,
      getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
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
            ({ id, createdAt, content, user: author, replyCount }) => (
              <div
                key={id}
                className="bg-white p-4 rounded-md border "
              >
                <Comment
                  id={id}
                  author={author.name}
                  content={content}
                  createdAt={new Date(createdAt)}
                  authorId={author.id}
                  userId={user ? user.id : null}
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
