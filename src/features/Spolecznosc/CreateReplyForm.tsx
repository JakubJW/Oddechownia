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
import { Send } from 'lucide-react';
import { Avatar } from '@/components/Avatar';
import { FetchCommentsResponse } from '@/server/models/comment.models';
import { CommentDetailDTO } from '@/server/models/comment.models';
import { useCallback } from 'react';

type Props = {
  postId: number;
  user: User;
  comment?: CommentDetailDTO;
  onEditCancel?: () => void;
};

export const ReplyForm = ({ postId, user, onEditCancel, comment }: Props) => {
  const { createMutation, updateMutation } = useCommentMutations();
  const form = useForm({
    resolver: zodResolver(craeteCommentFormSchema),
    defaultValues: comment
      ? { ...comment, postId }
      : {
          ...createCommentFormDefaultValues,
          postId,
        },
  });

  const onSubmit = useCallback(
    (values: CreateCommentValues) => {
      if (!comment) {
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
      }

      return updateMutation.mutate(
        { id: comment.id, values },
        {
          onSuccess: (updatedComment) => {
            queryClient.setQueryData<InfiniteData<FetchCommentsResponse>>(
              ['comments', postId],
              (oldData) => {
                console.log(oldData);
                if (!oldData) {
                  return oldData;
                }

                const result = oldData.pages.map((page) => ({
                  ...page,
                  data: page.data.map((comment) => {
                    if (comment.id === updatedComment.id) {
                      return updatedComment;
                    }

                    return comment;
                  }),
                }));

                return { ...oldData, pages: result };
              }
            );

            queryClient.invalidateQueries({
              queryKey: ['comments', postId],
              refetchType: 'none',
            });

            if (onEditCancel) {
              onEditCancel();
            }
          },
        }
      );
    },
    [createMutation, updateMutation, onEditCancel, form, comment, postId]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
                      <div className="flex-grow">
                        <div className="flex gap-4">
                          <Textarea
                            placeholder="Napisz odpowiedź..."
                            className="border-none bg-muted"
                            {...field}
                          />
                          <Button
                            disabled={
                              !form.formState.isValid ||
                              (comment && updateMutation.isPending) ||
                              (!comment && createMutation.isPending)
                            }
                            className="rounded-full"
                            size="icon"
                          >
                            <Send className="size-4" />
                          </Button>
                        </div>
                        {comment && (
                          <button
                            className="text-secondary-foreground hover:underline font-bold text-xs"
                            type="button"
                            onClick={() => onEditCancel && onEditCancel()}
                          >
                            Anuluj
                          </button>
                        )}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormControl>
          </div>
        </div>
      </form>
    </Form>
  );
};
