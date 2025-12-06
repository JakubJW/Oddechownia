'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePosts } from './hooks/usePosts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormField,
  FormControl,
  Form,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  CreatePostValues,
  createPostDefaultValues,
  createPostFormSchema,
} from './createPostFormSchema';
import TextEditor from '@/components/TextEditor/TextEditor';
import { useCallback } from 'react';
import { usePostMutations } from './hooks/usePostMutations';

export const PostForm = ({
  post,
  onEditCancel,
}: {
  post?: any;
  onEditCancel?: () => void;
}) => {
  const { createMutation, updateMutation } = usePostMutations();
  const form = useForm({
    resolver: zodResolver(createPostFormSchema),
    defaultValues: post ? { ...post } : { ...createPostDefaultValues },
  });

  const onSubmit = useCallback(
    (values: CreatePostValues) => {
      if (!post) {
        return createMutation.mutate(values, { onSuccess: () => form.reset() });
      }

      return updateMutation.mutate(
        { values, id: post.id },
        { onSuccess: () => form.reset() }
      );
    },
    [form, post, createMutation, updateMutation]
  );

  return (
    <div className="max-w-3xl mx-auto">
      <Form {...form}>
        <form
          className="space-y-3"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1 space-y-3">
              <FormControl>
                <FormField
                  name="title"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tytuł</FormLabel>
                      <Input
                        {...field}
                        placeholder="Tytuł posta..."
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormControl>
              <FormControl>
                <FormField
                  name="content"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Treść</FormLabel>
                      <TextEditor
                        value={field.value}
                        onChange={field.onChange}
                      />

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormControl>
            </div>
          </div>
          <Button type="submit">{post ? 'Zapisz' : 'Opublikuj'}</Button>
          {post && (
            <Button
              type="button"
              variant="secondary"
              className="ml-2"
              onClick={() => onEditCancel && onEditCancel()}
            >
              Anuluj
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};
