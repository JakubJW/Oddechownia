import { CommentForm } from '@/features/Lesson/Comments/Form/CommentForm';
import { Comments } from './Comments';
import { getUser } from '@/actions/user';

interface CommensSectionProps {
  lessonId: number;
}

export const CommentsSection = async ({ lessonId }: CommensSectionProps) => {
  const user = await getUser();

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-white rounded-md p-4 border">
        <CommentForm
          lessonId={lessonId}
          parentId={null}
        />
      </div>
      <Comments
        lessonId={lessonId}
        user={user}
      />
    </div>
  );
};
