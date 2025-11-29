import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { formSchema, defaultValues } from './schema';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useMutation, InfiniteData } from '@tanstack/react-query';
import { queryClient } from '@/components/QueryClientProvider';
import {
  CommentDetailDTO,
  FetchCommentsResponse,
} from '@/server/models/comment.models';

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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...defaultValues, parentId },
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
    onSuccess: (newReply) => {
      form.reset();
      toast.success('Twój komentarz został dodany.');
      onSuccess();

      form.reset();
      toast.success('Twój komentarz został dodany.');

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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  return (
    <div className="mt-4">
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
                    placeholder="Napisz odpowiedź..."
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="inline-flex self-end gap-2">
            <Button
              type="button"
              onClick={() => {
                form.reset();
                onCancel();
              }}
            >
              Anuluj
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending || !form.formState.isValid}
            >
              {mutation.isPending ? 'Dodawanie...' : 'Opublikuj'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
