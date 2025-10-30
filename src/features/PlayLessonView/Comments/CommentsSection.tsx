import { CommentForm } from '@/features/PlayLessonView/Comments/Form/CommentForm';
import { Comments } from './Comments';
import { cn } from '@/lib/utils';

interface CommensSectionProps {
  lessonId: number;
  className?: string;
}

export const CommentsSection = async ({
  lessonId,
  className,
}: CommensSectionProps) => {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="bg-white rounded-md p-4 border">
        <CommentForm lessonId={lessonId} />
      </div>
      <Comments lessonId={lessonId} />
    </div>
  );
};
