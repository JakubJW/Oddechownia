'use client';

import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { queryClient } from '@/components/QueryClientProvider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FetchCommentsResponse } from '@/server/models/comment.models';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { EllipsisVertical } from 'lucide-react';
import { ReplyForm } from './Form/ReplyForm';
import { CommentDetailDTO } from '@/server/models/comment.models';
import { User } from '@/server/actions/user';
import { Avatar } from '@/components/Avatar';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useCommentMutations } from './hooks/useCommentMutations';

export const Comment = ({
  id,
  parentId,
  author,
  createdAt,
  user,
  content,
  isAuthor,
  lessonId,
  replyCount,
  isAdmin,
}: CommentDetailDTO & { user: User }) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [replyMode, setReplyMode] = useState<boolean>(false);
  const { deleteMutation } = useCommentMutations();

  const fetchReplies = async ({ pageParam }: { pageParam: string | null }) => {
    const res = await fetch(`/api/comments/${id}/replies?cursor=${pageParam}`, {
      method: 'GET',
    });

    const json = await res.json();
    return json.data as FetchCommentsResponse;
  };

  const handleRemove = (id: number) => {
    return deleteMutation.mutate(id, {
      onSuccess: () => {
        const queryKey = parentId
          ? ['replies', parentId]
          : ['comments', lessonId];

        queryClient.setQueryData<InfiniteData<FetchCommentsResponse>>(
          queryKey,
          (oldData) => {
            if (!oldData) {
              return oldData;
            }

            const newPages = oldData.pages.map(({ data, ...rest }) => {
              const updatedItems = data.filter((item) => item.id !== id);
              return { ...rest, data: updatedItems };
            });

            return { ...oldData, pages: newPages };
          }
        );

        queryClient.invalidateQueries({
          queryKey,
          refetchType: 'none',
        });
      },
    });
  };

  const {
    isFetching,
    data: repliesData,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    initialPageParam: null,
    getNextPageParam: ({ nextCursor }) => nextCursor,
    queryKey: ['replies', id],
    queryFn: fetchReplies,
    enabled: showReplies,
  });

  return (
    <div className="mt-4">
      <div className="flex">
        <Avatar
          author={author}
          isAdmin={isAdmin}
        />
        <div className="flex-grow bg-muted rounded-lg p-2">
          <span className="text-sm">
            <div className="flex justify-between">
              <p className="text-sm font-normal">
                {author} &nbsp;
                <span className="text-muted-foreground font-light text-xs">
                  {formatDistanceToNow(new Date(createdAt), {
                    addSuffix: true,
                    locale: pl,
                  })}
                </span>
              </p>
            </div>
          </span>
          <p className="text-sm">{content}</p>
          <div className="space-x-2">
            {user && (
              <button
                className="text-xs text-muted-foreground inline-flex gap-1 items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  setReplyMode(true);
                }}
              >
                Odpowiedz
              </button>
            )}
            {replyCount && replyCount > 0 ? (
              <button
                disabled={isFetching}
                className="text-xs text-muted-foreground inline-flex gap-1 items-center"
                onClick={() => setShowReplies(true)}
              >
                Pokaż odpowiedzi ({replyCount})
                {isFetching && <Loader2 className="h-4 w-4 animate-spin" />}
              </button>
            ) : null}
          </div>
        </div>
        {isAuthor && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
              >
                <EllipsisVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* <DropdownMenuItem onClick={() => setEditMode(true)}>
                Edytuj
              </DropdownMenuItem> */}
              <DropdownMenuItem
                onClick={() => handleRemove(id)}
                className="bg-destructive-foreground text-destructive"
              >
                Usuń
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="flex flex-col ml-10">
        {replyMode && (
          <ReplyForm
            lessonId={lessonId!}
            parentId={id}
            onCancel={() => setReplyMode(false)}
            onSuccess={() => {
              setReplyMode(false);
            }}
          />
        )}
        {repliesData &&
          repliesData?.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.data.map(
                ({
                  id,
                  author,
                  content,
                  createdAt,
                  isAuthor,
                  lessonId,
                  replyCount,
                  parentId,
                  updatedAt,
                  isAdmin,
                }) => (
                  <Comment
                    isAdmin={isAdmin}
                    parentId={parentId}
                    key={id}
                    id={id}
                    user={user}
                    author={author}
                    content={content}
                    createdAt={createdAt}
                    updatedAt={updatedAt}
                    lessonId={lessonId}
                    isAuthor={isAuthor}
                    replyCount={replyCount}
                  />
                )
              )}
            </React.Fragment>
          ))}
        {hasNextPage && (
          <button
            className="self-start text-xs font-light mt-4 ml-10"
            disabled={isFetching}
            onClick={() => fetchNextPage()}
          >
            Pokaż więcej odpowiedzi
          </button>
        )}
      </div>
    </div>
  );
};
