'use client';

import { PostForm } from '@/features/Blog/Form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updatePost } from '../../actions';
import { formSchema } from './schema';

export const ClientComponent = ({ post }) => {
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
    formData.append('shortDescription', values.description);
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
