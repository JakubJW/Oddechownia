'use client';

import { createLesson, updateLesson } from '@/actions/lesson';
import { Button } from '@/components/ui/button';
import {
  Form, FormControl,
  FormField,
  FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LessonWithVideos } from '@/db/types';
import { zodResolver } from '@hookform/resolvers/zod';
import MuxPlayer from '@mux/mux-player-react/lazy';
import MuxUploader from '@mux/mux-uploader-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
  const [isUploaded, setIsUploaded] = useState(false);
  const router = useRouter();

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
