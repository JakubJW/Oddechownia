'use client';

import { Button } from '@/components/ui/button';
import { Comment } from '@/features/PlayLessonView/Comments/Comment';
import React from 'react';
import { User } from '@/server/actions/user';
import { useComments } from './hooks/useComments';
import { Loader2 } from 'lucide-react';

interface CommentsProps {
  lessonId: number;
  user: User;
}

export const Comments = ({ lessonId, user }: CommentsProps) => {
  const { queryComments } = useComments({
    entity: 'lesson',
    entityId: lessonId,
  });

  if (queryComments.isPending) {
    return <p>Ładowanie</p>;
  }

  if (queryComments.isError) {
    return (
      <div className="p-4 text-center">
        <p>Podczas ładowania komentarzy wystąpił błąd.</p>
      </div>
    );
  }

  if (!queryComments.data.pages[0]) {
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
      {queryComments.data?.pages.map((page, i) => (
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

      {queryComments.hasNextPage && (
        <Button
          className="self-center mt-6"
          disabled={queryComments.isFetching}
          onClick={() => queryComments.fetchNextPage()}
        >
          Pokaż więcej
          {queryComments.isFetching && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
        </Button>
      )}
    </div>
  );
};
