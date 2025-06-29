'use client';

import { createLesson, updateLesson } from '@/actions/lesson';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { formSchema, defaultValues } from './schema';

interface LessonFormProps {
  lesson?: LessonWithVideos;
  courseSlug: string;
}

export function AdminNewLesson({ courseSlug, lesson }: LessonFormProps) {
  const [isUploaded, setIsUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: lesson
      ? {
          name: lesson.name,
          description: lesson.description,
          courseSlug,
          video: {
            uploadId: lesson.video ? lesson.video?.uploadId : '',
          },
        }
      : { ...defaultValues, courseSlug },
    mode: 'all',
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!lesson) {
      setIsLoading(true);
      const { error } = await createLesson(values);
      setIsLoading(false);

      if (!error) {
        return router.push(`/admin/kurs/${courseSlug}`);
      } else {
        return setError(error);
      }
    }

    setIsLoading(true);
    const { error } = await updateLesson(lesson.slug, values);
    setIsLoading(false);

    if (!error) {
      return router.push(`/admin/kurs/${courseSlug}`);
    } else {
      return setError(error);
    }
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
                  <FormMessage />
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
                  <FormMessage />
                </FormItem>
              </FormItem>
            )}
          />
          {lesson && lesson.video ? (
            <>
              <MuxPlayer
                className="mb-6 w-full aspect-video rounded-lg overflow-hidden"
                streamType="on-demand"
                playbackId={lesson.video.publicPlaybackId || undefined}
                metadata={{
                  video_series: lesson.courseId,
                  video_title: lesson.name,
                  player_name: 'Video Course Starter Kit',
                }}
              />
              <Button>Usuń film</Button>
            </>
          ) : (
            <MuxUploader
              endpoint={async () => {
                const { data, error } = await fetch(
                  '/api/mux/create-upload'
                ).then((res) => res.json());

                if (error) {
                  return console.error(error);
                }

                form.setValue('video.uploadId', data.upload_id);
                return data.upload_url;
              }}
              type="bar"
              style={
                { '--button-border-radius': '40px' } as React.CSSProperties
              }
              onSuccess={() => setIsUploaded(true)}
              className="w-full mb-6"
            />
          )}
          {error && (
            <p className="text-sm font-medium text-destructive">{error}</p>
          )}
          <Button
            type="submit"
            disabled={isLoading || !isUploaded}
          >
            {isLoading
              ? 'Ładowanie...'
              : lesson
              ? 'Zapisz zmiany'
              : 'Utwórz lekcję'}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default AdminNewLesson;
