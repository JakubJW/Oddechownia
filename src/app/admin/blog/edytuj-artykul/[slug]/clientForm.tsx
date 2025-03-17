'use client';

import { PostForm } from '@/features/admin/Blog/Form/Form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updatePost } from '../../actions';
import { formSchema } from './schema';
import type { Post } from '@/lib/actions/post';

interface ClientComponentProps {
  post: Post;
}

export const ClientComponent = ({ post }: ClientComponentProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post.title,
      description: post.shortDescription,
      image: undefined,
      content: post.content,
    },
    mode: 'onChange',
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append('title', values.title);
    if (values.description) {
      formData.append('shortDescription', values.description);
    }
    formData.append('thumbnail', values.image);
    formData.append('content', values.content);

    await updatePost(post.id, formData);
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <PostForm
            form={form}
            currentImage={post.thumbnailUrl}
          />
          <Button type="submit">Zatwierdź</Button>
        </form>
      </Form>
    </div>
  );
};
