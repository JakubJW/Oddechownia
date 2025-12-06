import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormField,
  FormControl,
  Form,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  CreateCommentValues,
  craeteCommentFormSchema,
  createCommentFormDefaultValues,
} from '../PlayLessonView/Comments/Form/schema';
import { User } from '@/server/actions/user';
import { useCommentMutations } from '../PlayLessonView/Comments/hooks/useCommentMutations';
import { queryClient } from '@/components/QueryClientProvider';
import { InfiniteData } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Avatar } from '@/components/Avatar';
import { FetchCommentsResponse } from '@/server/models/comment.models';

type Props = { postId: number; user: User };

export const ReplyForm = ({ postId, user }: Props) => {
  const { createMutation } = useCommentMutations();
  const form = useForm({
    resolver: zodResolver(craeteCommentFormSchema),
    defaultValues: {
      ...createCommentFormDefaultValues,
      postId,
    },
  });

  const onSubmit = (values: CreateCommentValues) => {
    return createMutation.mutate(values, {
      onSuccess: (newComment) => {
        form.reset();
        queryClient.setQueryData<InfiniteData<FetchCommentsResponse>>(
          ['comments', postId],
          (oldData) => {
            if (!oldData) {
              return oldData;
            }

            const firstPage = oldData.pages[0];

            const updatedFirstPage = {
              ...firstPage,
              data: [newComment, ...firstPage.data],
            };

            const newPages = [updatedFirstPage, ...oldData.pages.slice(1)];

            return {
              ...oldData,
              pages: newPages,
            };
          }
        );

        queryClient.invalidateQueries({
          queryKey: ['comments', postId],
          refetchType: 'none',
        });
      },
    });
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex items-start gap-3">
          <div className="flex-1 space-y-3">
            <FormControl>
              <FormField
                name="content"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-4">
                      <Avatar
                        author={`${user?.firstName} ${user?.lastName}`}
                        isAdmin={user?.isAdmin}
                      />
                      <Textarea
                        placeholder="Napisz odpowiedź..."
                        className="border-none bg-muted"
                        {...field}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormControl>
          </div>
        </div>
        <Button
          disabled={!form.formState.isValid || createMutation.isPending}
          type="submit"
          size="sm"
          className="self-end"
        >
          Opublikuj
          {createMutation.isPending && (
            <Loader2 className="size-4 ml-2 animate-spin" />
          )}
        </Button>
      </form>
    </Form>
  );
};
