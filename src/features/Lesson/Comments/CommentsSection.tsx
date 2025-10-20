import { CommentForm } from '@/features/Lesson/Comments/Form/CommentForm';
import { Comments } from './Comments';

interface CommensSectionProps {
  lessonId: number;
}

export const CommentsSection = async ({ lessonId }: CommensSectionProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="bg-white rounded-md p-4 border">
        <CommentForm
          lessonId={lessonId}
          parentId={null}
        />
      </div>
      <Comments lessonId={lessonId} />
    </div>
  );
};
