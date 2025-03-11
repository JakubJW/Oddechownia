'use client';

import { PostForm } from '@/features/Blog/Form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const ClientComponent = ({ post }) => {
  const formSchema = z.object({
    title: z.string(),
    description: z.string(),
    image: z
      .any()
      .refine((file) => file.size <= 5000000, 'Max image size is 5MB'),
    content: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post.title,
      description: post.shortDescription,
      image: post.thumbnailUrl,
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
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <PostForm form={form} />
          <Button type="submit">Zatwierdź</Button>
        </form>
      </Form>
    </div>
  );
};
