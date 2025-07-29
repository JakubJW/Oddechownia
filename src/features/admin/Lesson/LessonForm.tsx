'use client';

import { createLesson, updateLesson, removeLesson } from '@/actions/lesson';
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
import { LessonWithVideo } from '@/db/types';
import { zodResolver } from '@hookform/resolvers/zod';
import MuxPlayer from '@mux/mux-player-react/lazy';
import MuxUploader from '@mux/mux-uploader-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { formSchema, defaultValues } from './schema';
import { deleteVideo } from '@/actions/video';
import { revalidatePath } from 'next/cache';

interface LessonFormProps {
  lesson?: LessonWithVideo;
}

export function AdminNewLesson({ lesson }: LessonFormProps) {
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
          videoId: lesson.video ? lesson.video?.id : null,
        }
      : { ...defaultValues },
    mode: 'all',
  });

  const handleRemoveLesson = async (id: number) => {
    await removeLesson(id);

    return router.push(`/admin/lekcje`);
  };

  const handleRemoveVideo = async (uploadId?: string) => {
    if (!uploadId) return;

    await deleteVideo(uploadId);

    revalidatePath(`/admin/lekcje/${lesson.slug}`);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    if (!lesson) {
      setIsLoading(true);
      const { error } = await createLesson(values);
      setIsLoading(false);

      if (!error) {
        return router.push(`/admin/lekcje`);
      } else {
        return setError(error);
      }
    }

    setIsLoading(true);
    const { error } = await updateLesson(lesson.slug, values);
    setIsLoading(false);

    if (!error) {
      return router.push(`/admin/lekcje`);
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
                playbackId={lesson.video.publicPlaybackId ?? undefined}
                metadata={{
                  video_title: lesson.name,
                  player_name: 'Video Course Starter Kit',
                }}
              />
              <Button
                type="button"
                onClick={async () =>
                  await handleRemoveVideo(lesson.video.uploadId)
                }
              >
                Usuń film
              </Button>
            </>
          ) : (
            <MuxUploader
              endpoint={async () => {
                const { result, error } = await fetch(
                  '/api/mux/create-upload'
                ).then((res) => res.json());

                if (error) {
                  return console.error(error);
                }

                console.log(result.data.id);

                form.setValue('videoId', result.data.id);
                return result.upload_url;
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
          {lesson && (
            <Button
              type="button"
              variant="destructive"
              onClick={async () => await handleRemoveLesson(lesson.id)}
            >
              Usuń lekcję
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
}

export default AdminNewLesson;
