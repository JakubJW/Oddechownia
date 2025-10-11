'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReplyForm } from './Form/ReplyForm';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/components/QueryClientProvider';

interface CommentProps {
  id: number;
  author: string;
  createdAt: Date;
  content: string;
  userId: string | null;
  authorId: string;
  lessonId: number;
  replyCount: number;
}

export const Comment = ({
  id,
  author,
  createdAt,
  content,
  authorId,
  userId,
  lessonId,
  replyCount,
}: CommentProps) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [replyMode, setReplyMode] = useState<boolean>(false);

  const removeComment = async (commentId: number) => {
    const res = await fetch(`/api/comments/remove/${commentId}`, {
      method: 'DELETE',
    });

    const json = await res.json();
    return json.data;
  };

  const fetchReplies = async (commentId: number) => {
    const res = await fetch(`/api/comments/replies/${commentId}`, {
      method: 'GET',
    });

    const json = await res.json();
    return json.data;
  };

  const mutation = useMutation({
    mutationFn: ({ id }: { id: number }) => {
      return removeComment(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments'] }),
  });

  const {
    isPending,
    isFetching,
    isError,
    data: repliesData,
    error,
  } = useQuery({
    queryKey: ['replies', id],
    queryFn: () => fetchReplies(id),
    enabled: showReplies,
  });

  return (
    <div>
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
            <button
              className="text-sm inline-flex gap-1 items-center"
              onClick={() => setReplyMode(true)}
            >
              Odpowiedz
            </button>
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
        {authorId === userId && (
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
      <div className="ml-10 mt-4">
        {replyMode && (
          <ReplyForm
            lessonId={lessonId}
            userId={userId}
            parentId={id}
            onCancel={() => setReplyMode(false)}
            onSuccess={() => {
              setReplyMode(false);
              queryClient.invalidateQueries({ queryKey: ['replies', id] });
            }}
          />
        )}
        {repliesData &&
          repliesData.map((reply) => (
            <Comment
              key={reply.id}
              id={reply.id}
              author={reply.user.name}
              content={reply.content}
              createdAt={new Date(reply.createdAt)}
              authorId={reply.userId}
              userId={userId}
              lessonId={reply.lessonId}
              replyCount={reply.replyCount}
            />
          ))}
      </div>
    </div>
  );
};
