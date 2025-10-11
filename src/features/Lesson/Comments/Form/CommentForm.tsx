'use client';

import { Button } from '@/components/ui/button';
import { createComment } from '@/actions/comments';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { formSchema, defaultValues } from './schema';
import { useActionResult } from '@/hooks/useActionResult';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { queryClient } from '@/components/QueryClientProvider';

interface CommentFormProps {
  lessonId: number;
  parentId: number | null;
}

export const CommentForm = ({ lessonId, parentId }: CommentFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { isLoading, execute: submitForm } = useActionResult(createComment, {
    onSuccess: () => {
      form.reset();
      toast.success('Twój komentarz został dodany.');
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
    onError: (error) => {
      setError(error);
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null);
    submitForm({
      ...values,
      lessonId,
      parentId,
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
            disabled={isLoading || !form.formState.isValid}
          >
            {isLoading ? 'Dodawanie' : 'Opublikuj'}
          </Button>
          {error && (
            <p className="text-sm font-medium text-destructive">{error}</p>
          )}
        </form>
      </Form>
    </div>
  );
};
