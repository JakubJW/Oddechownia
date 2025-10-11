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
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from '@/components/ui/shadcn-io/dropzone';
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

interface LessonFormProps {
  lesson?: Lesson;
}

export function AdminNewLesson({ lesson }: LessonFormProps) {
  const [isUploaded, setIsUploaded] = useState(false);
  const [thumbnail, setThumbnail] = useState<File[] | undefined>();
  const [thumbnailPreview, setThumbnailPreview] = useState<
    string | undefined
  >();
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

      for (let i = 0; i < attachments.length; i++) {
        formData.append('newAttachments[]', attachments[i]);
      }

      for (let i = 0; i < attachmentsToRemove.length; i++) {
        formData.append(
          'attachmentsToRemove[]',
          String(attachmentsToRemove[i])
        );
      }

      if (lesson) {
        return updateLesson(lesson.id, formData);
      } else {
        return createLesson(formData);
      }
    },
    [lesson, attachments, attachmentsToRemove]
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

  const handleDrop = (files: File[]) => {
    setAttachments((prevAttachments) => [...prevAttachments, ...files]);
  };

  const handleThumbnailDrop = (files: File[]) => {
    setThumbnail(files);

    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          setThumbnailPreview(e.target?.result);
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleRemoveFile = (name: string) => {
    setAttachments((prevAttachments) =>
      prevAttachments.filter((file) => file.name !== name)
    );
  };

  const handleRemoveAttachment = (id: number) => {
    setAttachmentsToRemove((prevAttachmentsToRemove) => [
      ...prevAttachmentsToRemove,
      id,
    ]);
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
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Miniaturka</Label>
              <Dropzone
                className="aspect-video"
                accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
                onDrop={handleThumbnailDrop}
                src={thumbnail}
              >
                <DropzoneEmptyState />
                <DropzoneContent>
                  {thumbnailPreview && (
                    <div className="h-[102px] w-full">
                      <img
                        alt="Preview"
                        className="absolute top-0 left-0 h-full w-full object-cover"
                        src={thumbnailPreview}
                      />
                    </div>
                  )}
                </DropzoneContent>
              </Dropzone>
            </div>
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
                disabled={isLoading || (!lesson && !isUploaded)}
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
