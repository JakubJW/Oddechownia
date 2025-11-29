'use client';

import { Button } from '@/components/ui/button';
import { Comment } from '@/features/PlayLessonView/Comments/Comment';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';
import { FetchCommentsResponse } from '@/server/models/comment.models';
import { User } from '@/server/actions/user';

interface CommentsProps {
  lessonId: number;
  user: User;
}

export const Comments = ({ lessonId, user }: CommentsProps) => {
  const fetchComments = async ({ pageParam }: { pageParam: string | null }) => {
    const res = await fetch(`/api/comments/${lessonId}?cursor=${pageParam}`);

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
    return json.data as FetchCommentsResponse;
  };

  const { data, isError, fetchNextPage, hasNextPage, isFetching, isPending } =
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

  if (isError) {
    return (
      <div className="p-4 text-center">
        <p>Podczas ładowania komentarzy wystąpił błąd.</p>
      </div>
    );
  }

  if (!data.pages[0]) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">
          Pod tą lekcją nie ma jeszcze żadnych komentarzy.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.data.map(
            ({
              id,
              createdAt,
              content,
              author,
              replyCount,
              isAuthor,
              isAdmin,
              updatedAt,
            }) => (
              <Comment
                key={id}
                user={user}
                isAdmin={isAdmin}
                id={id}
                author={author}
                content={content}
                createdAt={createdAt}
                updatedAt={updatedAt}
                isAuthor={isAuthor}
                lessonId={lessonId}
                replyCount={replyCount}
              />
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
