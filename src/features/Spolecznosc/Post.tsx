import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale/pl';

type Props = {
  title: string;
  content: string;
  author: string;
  createdAt: string;
};

export const Post = ({ title, content, author, createdAt }: Props) => {
  return (
    <div className="border shadow-sm rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-4">
          <div className="rounded-full flex items-center justify-center w-8 h-8 bg-muted">
            <span className="text-sm font-light">
              {author.split(' ')[0].charAt(0)}
            </span>
          </div>
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
        {/* {isAdmin && user?.id === post.user_id && (
          <div className="flex gap-1">
            {editingId === post.id ? (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => handleEditPost(post.id)}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={cancelEdit}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => startEdit(post)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edytuj
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeletePost(post.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Usuń
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )} */}
      </div>

      {/* Post Content */}
      <div className="space-y-2">
        {/* {editingId === post.id ? (
            <>
              <Input
                value={editPost.title}
                onChange={(e) =>
                  setEditPost({ ...editPost, title: e.target.value })
                }
                className="font-semibold"
                maxLength={200}
              />
              <Textarea
                value={editPost.content}
                onChange={(e) =>
                  setEditPost({ ...editPost, content: e.target.value })
                }
                className="resize-none"
                rows={4}
                maxLength={5000}
              />
            </>
          ) : (
            <> */}
        <h3 className="font-semibold text-base">{title}</h3>
        <p
          className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }}
        ></p>
        {/* </> */}
        {/* )} */}
      </div>
      {/* </CardContent> */}

      {/* Post Reactions & Comments */}
      {/* <CardContent className="pt-3 space-y-3">
        <PostReactions postId={post.id} />
        <div className="border-t pt-3">
          <PostComments postId={post.id} />
        </div>
      </CardContent> */}
    </div>
  );
};
