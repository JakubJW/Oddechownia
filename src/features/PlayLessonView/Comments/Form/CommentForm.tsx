'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { queryClient } from '@/components/QueryClientProvider';
import { InfiniteData } from '@tanstack/react-query';
import { FetchCommentsResponse } from '@/server/models/comment.models';
import { useCommentMutations } from '../hooks/useCommentMutations';
import {
  CreateCommentValues,
  createCommentFormDefaultValues,
  craeteCommentFormSchema,
} from './schema';
import { Loader2 } from 'lucide-react';

interface CommentFormProps {
  lessonId: number;
}

export const CommentForm = ({ lessonId }: CommentFormProps) => {
  const { createMutation } = useCommentMutations();
  const form = useForm<CreateCommentValues>({
    resolver: zodResolver(craeteCommentFormSchema),
    defaultValues: {
      ...createCommentFormDefaultValues,
      parentId: null,
      lessonId,
    },
  });

  const onSubmit = (values: CreateCommentValues) => {
    createMutation.mutate(values, {
      onSuccess: (newComment) => {
        form.reset();
        queryClient.setQueryData<InfiniteData<FetchCommentsResponse>>(
          ['comments', lessonId],
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
          queryKey: ['comments', lessonId],
          refetchType: 'none',
        });
      },
    });
  };

  return (
    <div>
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
                    placeholder="Napisz komentarz..."
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="self-end"
            disabled={createMutation.isPending || !form.formState.isValid}
          >
            Opublikuj
            {createMutation.isPending && (
              <Loader2 className="size-4 ml-2 animate-spin" />
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
