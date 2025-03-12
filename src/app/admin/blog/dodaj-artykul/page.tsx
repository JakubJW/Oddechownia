'use client';

import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { createPost } from '../actions';
import { PostForm } from '@/features/Blog/Form';
import { formSchema } from './schema';

export default function DodajArtykul() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      image: undefined,
      content: '',
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

    await createPost(formData);
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
}
