import { Avatar } from '@/components/Avatar';
import { queryClient } from '@/components/QueryClientProvider';
import { Button } from '@/components/ui/button';
import { User } from '@/server/actions/user';
import {
  CommentDetailDTO,
  FetchCommentsResponse,
} from '@/server/models/comment.models';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { InfiniteData } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Edit2, EllipsisVerticalIcon, Trash2 } from 'lucide-react';
import { useCommentMutations } from '../PlayLessonView/Comments/hooks/useCommentMutations';
import { useState } from 'react';
import { ReplyForm } from './CreateReplyForm';

type Props = {
  comment: CommentDetailDTO;
  user: User;
};

export const PostComment = ({ comment, user }: Props) => {
  const [editMode, setEditMode] = useState(false);
  const { deleteMutation } = useCommentMutations();

  const handleRemove = (commentId: number) => {
    return deleteMutation.mutate(commentId, {
      onSuccess: () => {
        queryClient.setQueryData<InfiniteData<FetchCommentsResponse>>(
          ['comments', comment.postId],
          (oldData) => {
            if (!oldData) {
              return oldData;
            }

            const newPages = oldData.pages.map(({ data, ...rest }) => {
              const updatedItems = data.filter((item) => item.id !== commentId);
              return { ...rest, data: updatedItems };
            });

            return { ...oldData, pages: newPages };
          }
        );

        queryClient.invalidateQueries({
          queryKey: ['comments', comment.postId],
          refetchType: 'none',
        });
      },
    });
  };

  if (editMode) {
    return (
      <ReplyForm
        onEditCancel={() => setEditMode(false)}
        user={user}
        postId={comment.postId!}
        comment={comment}
      />
    );
  }

  return (
    <div
      key={comment.id}
      className="flex gap-4"
    >
      <Avatar
        author={comment.author}
        isAdmin={comment.isAdmin}
      />
      <div className="flex-grow">
        <div className="bg-muted space-y-0.5 p-2 rounded-md">
          <p className="text-sm font-semibold">
            {comment.author.split(' ')[0]}
          </p>
          <p className="text-sm text-muted-foreground">{comment.content}</p>
        </div>
        <span className="text-muted-foreground font-light text-xs">
          {formatDistanceToNow(new Date(comment.createdAt), {
            addSuffix: true,
            locale: pl,
          })}
        </span>
      </div>
      {(comment.isAuthor || user?.isAdmin) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
            >
              <EllipsisVerticalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditMode(true)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edytuj
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleRemove(comment.id)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Usuń
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
