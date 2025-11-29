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
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
} from '@tanstack/react-query';
import { EllipsisVertical } from 'lucide-react';
import { ReplyForm } from './Form/ReplyForm';
import { cn } from '@/lib/utils';
import { CommentDetailDTO } from '@/server/models/comment.models';
import { User } from '@/server/actions/user';

const removeComment = async (commentId: number) => {
  const res = await fetch(`/api/comments/remove/${commentId}`, {
    method: 'DELETE',
  });

  const json = await res.json();
  return json.data;
};

export const Comment = ({
  id,
  parentId,
  author,
  createdAt,
  updatedAt,
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

  const fetchReplies = async ({ pageParam }: { pageParam: string | null }) => {
    const res = await fetch(`/api/comments/replies/${id}?cursor=${pageParam}`, {
      method: 'GET',
    });

    const json = await res.json();
    return json.data as FetchCommentsResponse;
  };

  const mutation = useMutation({
    mutationFn: ({ id }: { id: number }) => {
      return removeComment(id);
    },
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

  const { isFetching, data: repliesData } = useInfiniteQuery({
    initialPageParam: null,
    getNextPageParam: ({ nextCursor }) => nextCursor,
    queryKey: ['replies', id],
    queryFn: fetchReplies,
    enabled: showReplies,
  });

  return (
    <div className={cn(isAdmin && 'bg-red-500', 'mt-4')}>
      <div className="flex">
        <div className="rounded-full flex items-center justify-center w-8 h-8 bg-muted mr-4">
          <span className="text-sm font-light">
            {author.split(' ')[0].charAt(0)}
            {author.split(' ')[1].charAt(0)}
          </span>
        </div>
        <div className="flex-grow">
          <span className="text-sm">
            <div className="flex justify-between">
              <span>
                {author}, {new Date(createdAt).toLocaleDateString()}, &nbsp;
                {new Date(createdAt).toLocaleTimeString()}
              </span>
            </div>
          </span>
          <p>{content}</p>
          <div className="space-x-2">
            {user && (
              <button
                className="text-sm inline-flex gap-1 items-center"
                onClick={() => setReplyMode(true)}
              >
                Odpowiedz
              </button>
            )}
            {replyCount > 0 && !repliesData && (
              <button
                disabled={isFetching}
                className="text-sm inline-flex gap-1 items-center"
                onClick={() => setShowReplies(true)}
              >
                Pokaż odpowiedzi ({replyCount})
                {isFetching && <Loader2 className="h-4 w-4 animate-spin" />}
              </button>
            )}
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
              <DropdownMenuItem onClick={() => setEditMode(true)}>
                Edytuj
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => mutation.mutate({ id })}
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
            lessonId={lessonId}
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
      </div>
    </div>
  );
};
