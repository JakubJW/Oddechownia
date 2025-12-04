'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
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

export const NewPostForm = () => {
  const { createMutation } = usePosts();
  const form = useForm({
    resolver: zodResolver(createPostFormSchema),
    defaultValues: createPostDefaultValues,
  });

  const onSubmit = (values: CreatePostValues) => {
    createMutation.mutate(values);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <p className="text-muted-foreground text-lg font-light mb-4">
        Podziel się swoimi przemyśleniami...
      </p>
      <div>
        <Form {...form}>
          <form
            className="space-y-3"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex items-start gap-3">
              {/* <Avatar className="h-10 w-10">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {user?.email?.[0].toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar> */}
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
            <Button type="submit">Opublikuj</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
