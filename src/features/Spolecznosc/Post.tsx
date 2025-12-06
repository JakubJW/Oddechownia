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
import { ReplyForm } from './ReplyForm';
import { User } from '@/server/actions/user';
import { usePostMutations } from './hooks/usePostMutations';
import { Avatar } from '@/components/Avatar';
import { PostDetailDTO } from '@/server/models/post.models';
import { useComments } from '../PlayLessonView/Comments/hooks/useComments';

type Props = PostDetailDTO & { user: User };

export const Post = ({
  title,
  content,
  author,
  createdAt,
  comments,
  id,
  user,
  isAuthor,
  isAdmin,
}: Props) => {
  const [editMode, setEditMode] = useState(false);
  const { deleteMutation } = usePostMutations();
  const { queryComments } = useComments({
    entity: 'post',
    entityId: id,
    initialData: comments,
  });

  return (
    <div className="border shadow-sm rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-4">
          <Avatar
            author={author}
            isAdmin={isAdmin}
          />
          <div>
            <p className="font-semibold text-sm leading-tight">
              {author.split(' ')[0]}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(createdAt), {
                addSuffix: true,
                locale: pl,
              })}
            </p>
          </div>
        </div>
        {(isAuthor || user?.isAdmin) && (
          <div className="flex gap-1">
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
                  onClick={() => deleteMutation.mutate(id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Usuń
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      {editMode ? (
        <PostForm
          post={{ content, title, id }}
          onEditCancel={() => setEditMode(false)}
        />
      ) : (
        <>
          <h3 className="font-semibold text-base">{title}</h3>
          <p
            className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </>
      )}
      <div className="my-4">
        {queryComments.data.pages.map((page) =>
          page.data.map((comment) => (
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
                  <p className="text-sm font-semibold">{comment.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {comment.content}
                  </p>
                </div>
                <span className="text-muted-foreground text-xs">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                    locale: pl,
                  })}
                </span>
              </div>
            </div>
          ))
        )}
        {queryComments.hasNextPage && (
          <button
            className="self-start text-xs font-light mt-4 ml-10"
            disabled={queryComments.isFetching}
            onClick={() => queryComments.fetchNextPage()}
          >
            Pokaż więcej komentarzy
          </button>
        )}
      </div>
      <ReplyForm
        user={user}
        postId={id}
      />
    </div>
  );
};
