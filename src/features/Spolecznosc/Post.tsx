import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale/pl';
import { EllipsisVerticalIcon, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostForm } from './PostForm';
import { useState } from 'react';
import { ReplyForm } from './CreateReplyForm';
import { User } from '@/server/actions/user';
import { usePostMutations } from './hooks/usePostMutations';
import { Avatar } from '@/components/Avatar';
import { PostDetailDTO } from '@/server/models/post.models';
import { PostComments } from './PostComments';

type Props = {
  post: PostDetailDTO;
  user: User;
};

export const Post = ({ post, user }: Props) => {
  const [editMode, setEditMode] = useState(false);
  const { deleteMutation } = usePostMutations();

  return (
    <div className="border shadow-sm rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-4">
          <Avatar
            author={post.author}
            isAdmin={post.isAdmin}
          />
          <div>
            <p className="font-semibold text-sm leading-tight">
              {post.author.split(' ')[0]}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
                locale: pl,
              })}
            </p>
          </div>
        </div>
        {(post.isAuthor || user?.isAdmin) && (
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
                onClick={() => deleteMutation.mutate(post.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Usuń
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {editMode ? (
        <PostForm
          post={post}
          onEditCancel={() => setEditMode(false)}
        />
      ) : (
        <>
          <h3 className="font-semibold text-base">{post.title}</h3>
          <p
            className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </>
      )}
      <PostComments
        comments={post.comments}
        postId={post.id}
        user={user}
      />
      <ReplyForm
        user={user}
        postId={post.id}
      />
    </div>
  );
};
