import { CommentForm } from '@/features/PlayLessonView/Comments/Form/CommentForm';
import { Comments } from './Comments';
import { cn } from '@/lib/utils';
import { User } from '@/server/actions/user';

interface CommensSectionProps {
  lessonId: number;
  className?: string;
  user: User
}

export const CommentsSection = async ({
  lessonId,
  className,
  user
}: CommensSectionProps) => {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {user && <div className="bg-white rounded-md p-4 border">
        <CommentForm lessonId={lessonId} />
      </div>}
      <Comments lessonId={lessonId} user={user} />
    </div>
  );
};
