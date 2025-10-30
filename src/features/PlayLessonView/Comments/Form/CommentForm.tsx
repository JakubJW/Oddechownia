'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { formSchema, defaultValues } from './schema';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { queryClient } from '@/components/QueryClientProvider';
import { useMutation, InfiniteData } from '@tanstack/react-query';
import {
  CommentDetailDTO,
  FetchCommentsResponse,
} from '@/server/models/comment.models';

interface CommentFormProps {
  lessonId: number;
}

export const CommentForm = ({ lessonId }: CommentFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...defaultValues, parentId: null },
  });

  const createComment = async (
    lessonId: number,
    values: z.infer<typeof formSchema>
  ) => {
    const res = await fetch(`/api/comments/${lessonId}`, {
      method: 'POST',
      body: JSON.stringify(values),
    });

    const json = await res.json();
    return json.data as CommentDetailDTO;
  };

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      createComment(lessonId, values),
    onSuccess: (newComment) => {
      form.reset();
      toast.success('Twój komentarz został dodany.');

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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
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
                    className="w-full h-auto"
                    name="content"
                    id="content"
                    placeholder="Napisz komentarz..."
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="self-end"
            disabled={mutation.isPending || !form.formState.isValid}
          >
            {mutation.isPending ? 'Dodawanie' : 'Opublikuj'}
          </Button>
        </form>
      </Form>
    </div>
  );
};
