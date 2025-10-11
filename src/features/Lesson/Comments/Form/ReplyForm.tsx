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

interface ReplyFormProps {
  lessonId: number;
  userId: string;
  parentId: number | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export const ReplyForm = ({
  userId,
  lessonId,
  parentId,
  onCancel,
  onSuccess,
}: ReplyFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { isLoading, execute: submitForm } = useActionResult(createComment, {
    onSuccess: () => {
      form.reset();
      toast.success('Twoja odpowiedź została dodana.');
      onSuccess();
    },
    onError: (error) => {
      setError(error);
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null);
    submitForm({
      ...values,
      userId,
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
              disabled={isLoading || !form.formState.isValid}
            >
              {isLoading ? 'Dodawanie...' : 'Opublikuj'}
            </Button>
          </div>
          {error && (
            <p className="text-sm font-medium text-destructive">{error}</p>
          )}
        </form>
      </Form>
    </div>
  );
};
