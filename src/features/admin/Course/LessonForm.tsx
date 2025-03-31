'use client';

import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  createLesson,
  updateLesson,
} from '@/actions/lesson';
import { useRouter } from 'next/navigation';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import MuxUploader from '@mux/mux-uploader-react';
import { LessonWithVideos } from '@/db/types';
import MuxPlayer from '@mux/mux-player-react/lazy';

interface LessonFormProps {
  lesson?: LessonWithVideos;
  courseSlug: string;
}

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  isPublished: z.boolean(),
  uploadId: z.string(),
  courseSlug: z.string(),
});

const initialState = {
  name: '',
  description: '',
  isPublished: false,
  uploadId: '',
};

export function AdminNewLesson({ courseSlug, lesson }: LessonFormProps) {
  const router = useRouter();
  const [isUploaded, setIsUploaded] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: lesson
      ? {
          name: lesson.name,
          description: lesson.description,
        }
      : { ...initialState, courseSlug },
    mode: 'onChange',
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (lesson) {
      await updateLesson(lesson.slug, values);
    } else {
      await createLesson(values);
    }

    router.push(`/admin/kursy`);
  };

  return (
    <div>
      <h1>{lesson ? 'Edytuj lekcję' : 'Dodaj lekcję'}</h1>
      <Form {...form}>
        <form
          className="flex flex-col gap-4 max-w-lg w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormItem>
                  <FormLabel>Nazwa lekcji</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormItem>
                  <FormLabel>Opis</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              </FormItem>
            )}
          />
          {lesson ? (
            <MuxPlayer
              className="mb-6 w-full aspect-video"
              streamType="on-demand"
              playbackId={lesson.video?.publicPlaybackId || undefined}
              metadata={{
                video_series: lesson.courseId,
                video_title: lesson.name,
                player_name: 'Video Course Starter Kit',
              }}
            />
          ) : (
            <MuxUploader
              endpoint={async () => {
                const res = await fetch('/api/mux/create-upload').then((res) =>
                  res.json()
                );
                form.setValue('uploadId', res.upload_id);
                return res.upload_url;
              }}
              type="bar"
              style={
                { '--button-border-radius': '40px' } as React.CSSProperties
              }
              onSuccess={() => setIsUploaded(true)}
              className="w-full mb-6"
            />
          )}
          <Button
            disabled={!lesson && !isUploaded}
            type="submit"
          >
            {lesson ? 'Zapisz zmiany' : 'Utwórz lekcję'}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default AdminNewLesson;
