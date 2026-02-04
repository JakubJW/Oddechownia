import { CommentDetailDTO } from '@/server/models/comment.models';
import { useComments } from '../lesson-playback/Comments/hooks/useComments';
import { User } from '@/server/actions/user';
import { PostComment } from './PostComment';

type Props = { comments: CommentDetailDTO[]; postId: number; user: User };

export const PostComments = ({ comments, postId, user }: Props) => {
  const { queryComments } = useComments({
    entity: 'post',
    entityId: postId,
    initialData: comments,
  });

  return (
    <div className="my-4">
      <div className="flex flex-col gap-2">
        {queryComments.data.pages.map((page) =>
          page.data.map((comment) => (
            <PostComment
              user={user}
              key={comment.id}
              comment={comment}
            />
          ))
        )}
      </div>
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
  );
};
