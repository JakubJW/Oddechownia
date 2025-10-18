'use client';

import { createLesson, removeLesson, updateLesson } from '@/actions/lesson';
import { deleteVideo } from '@/actions/video';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Lesson } from '@/db/types';
import { useActionResult } from '@/hooks/useActionResult';
import { zodResolver } from '@hookform/resolvers/zod';
import MuxPlayer from '@mux/mux-player-react/lazy';
import MuxUploader from '@mux/mux-uploader-react';
import { revalidatePath } from 'next/cache';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { defaultValues, formSchema } from './schema';
import FormAttachments from './Form/Attachments';
import FormThumbnail from './Form/Thumbnail';

interface LessonFormProps {
  lesson?: Lesson;
}

export function AdminNewLesson({ lesson }: LessonFormProps) {
  const [newAttachments, setNewAttachments] = useState<File[]>([]);
  const [attachmentsToRemove, setAttachmentsToRemove] = useState<number[]>([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [thumbnail, setThumbnail] = useState<File[]>([]);
  const [removeOldThumbnail, setRemoveOldThumbnail] = useState<boolean>(false);

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

  const handleRemoveVideo = async (lesson: Lesson) => {
    if (!lesson || !lesson.video || !lesson.video.uploadId) return;

    await deleteVideo(lesson.video.uploadId);

    revalidatePath(`/admin/lekcje/${lesson.slug}`);
  };

  const handleFormSubmissionAction = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('videoId', String(values.videoId));

      for (let i = 0; i < newAttachments.length; i++) {
        formData.append('newAttachments[]', newAttachments[i]);
      }

      for (let i = 0; i < attachmentsToRemove.length; i++) {
        formData.append(
          'attachmentsToRemove[]',
          String(attachmentsToRemove[i])
        );
      }

      if (!lesson) {
        for (let i = 0; i < thumbnail.length; i++) {
          formData.append('thumbnail[]', thumbnail[i]);
        }

        return createLesson(formData);
      }

      for (let i = 0; i < thumbnail.length; i++) {
        formData.append('thumbnail[]', thumbnail[i]);
        formData.append('removeOldThumbnail', String(removeOldThumbnail));
      }

      return updateLesson(lesson.id, formData);
    },
    [lesson, newAttachments, attachmentsToRemove, thumbnail, removeOldThumbnail]
  );

  const { execute: submitForm, isLoading } = useActionResult(
    handleFormSubmissionAction,
    {
      onSuccess: () => {
        router.push(`/admin/lekcje`);
      },
      onError: (error) => {
        form.setError('root.serverError', { type: 'server', message: error });
      },
    }
  );

  const handleRemoveAttachment = (id: number) => {
    setAttachmentsToRemove((prevAttachmentsToRemove) => [
      ...prevAttachmentsToRemove,
      id,
    ]);
  };

  const handleRemoveNewAttachment = (name: string) => {
    setNewAttachments((prevNewAttachments) =>
      prevNewAttachments.filter((file) => file.name !== name)
    );
  };

  const handleAddAttachment = (files: File[]) => {
    setNewAttachments((prevAttachments) => [...prevAttachments, ...files]);
  };

  const handleThumbnail = (files: File[]) => {
    setThumbnail(files);
  };

  return (
    <div>
      <h1>{lesson ? 'Edytuj lekcję' : 'Dodaj lekcję'}</h1>
      <Form {...form}>
        <form
          className="grid grid-cols-2 gap-8 w-full"
          onSubmit={form.handleSubmit(submitForm)}
        >
          <div className="space-y-4">
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
                      <Textarea
                        {...field}
                        className="min-h-[200px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormItem>
              )}
            />
            <FormAttachments
              attachments={lesson?.attachments}
              onRemove={(id) => handleRemoveAttachment(id)}
              onNewRemove={(name) => handleRemoveNewAttachment(name)}
              onAdd={(files) => handleAddAttachment(files)}
              newAttachments={newAttachments}
              attachmentsToRemove={attachmentsToRemove}
            />
          </div>
          <div className="space-y-4">
            <FormThumbnail
              removeOldThumbnailHandler={setRemoveOldThumbnail}
              thumbnail={thumbnail}
              onDrop={(files) => handleThumbnail(files)}
              currentThumbnailUrl={lesson?.thumbnailUrl}
            />
            <div className="space-y-2">
              <Label>Film</Label>
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
                    onClick={async () => await handleRemoveVideo(lesson)}
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
            </div>
          </div>

          <div className="col-span-2">
            {form.formState.errors.root?.serverError && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.root?.serverError.message}
              </p>
            )}
            <div className="flex justify-between">
              <Button
                type="submit"
                disabled={isLoading}
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
                  onClick={async () => await handleRemoveLesson(lesson.id)}
                >
                  Usuń lekcję
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default AdminNewLesson;
