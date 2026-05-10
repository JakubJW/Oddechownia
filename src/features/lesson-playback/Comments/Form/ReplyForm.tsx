import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  craeteCommentFormSchema,
  createCommentFormDefaultValues,
  CreateCommentValues,
} from './schema';
import { Textarea } from '@/components/ui/textarea';
import { InfiniteData } from '@tanstack/react-query';
import { queryClient } from '@/components/QueryClientProvider';
import { FetchCommentsResponse } from '@/server/models/comment.models';
import { useCommentMutations } from '../hooks/useCommentMutations';
import { Loader2 } from 'lucide-react';

interface ReplyFormProps {
  lessonId: number;
  parentId: number | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export const ReplyForm = ({
  lessonId,
  parentId,
  onCancel,
  onSuccess,
}: ReplyFormProps) => {
  const { createMutation } = useCommentMutations();
  const form = useForm({
    resolver: zodResolver(craeteCommentFormSchema),
    defaultValues: { ...createCommentFormDefaultValues, parentId, lessonId },
  });

  const onSubmit = (values: CreateCommentValues) => {
    createMutation.mutate(values, {
      onSuccess: (newReply) => {
        form.reset();
        onSuccess();

        queryClient.setQueryData<InfiniteData<FetchCommentsResponse>>(
          ['replies', parentId],
          (oldData) => {
            if (!oldData) {
              return oldData;
            }

            const firstPage = oldData.pages[0];

            const updatedFirstPage = {
              ...firstPage,
              data: [newReply, ...firstPage.data],
            };

            const newPages = [updatedFirstPage, ...oldData.pages.slice(1)].map(
              (page) => ({
                ...page,
                items: page.data.map((comment) => {
                  if (comment.id === parentId) {
                    return {
                      ...comment,
                      replyCount: (comment.replyCount || 0) + 1,
                    };
                  }
                  return comment;
                }),
              })
            );

            return {
              ...oldData,
              pages: newPages,
            };
          }
        );

        queryClient.setQueryData<InfiniteData<FetchCommentsResponse>>(
          ['comments', lessonId],
          (oldData) => {
            if (!oldData) {
              return oldData;
            }

            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                data: page.data.map((comment) => {
                  if (comment.id === parentId) {
                    return {
                      ...comment,
                      replyCount: (comment.replyCount || 0) + 1,
                    };
                  }
                  return comment;
                }),
              })),
            };
          }
        );

        queryClient.invalidateQueries({
          queryKey: ['replies', lessonId],
          refetchType: 'none',
        });
      },
    });
  };

  return (
    <div className="mt-4 mr-9">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormControl>
                  <Textarea
                    {...field}
                    className="border-none bg-muted resize-none"
                    placeholder="Napisz odpowiedź..."
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="inline-flex self-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                form.reset();
                onCancel();
              }}
            >
              Anuluj
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={createMutation.isPending || !form.formState.isValid}
            >
              Opublikuj
              {createMutation.isPending && (
                <Loader2 className="size-4 ml-2 animate-spin" />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
