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
import { Lesson } from '@/db/types';
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
import { useActionResult } from '@/hooks/useActionResult';
import { useCallback } from 'react';
import Link from 'next/link';
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from '@/components/ui/shadcn-io/dropzone';
import { Trash } from 'lucide-react';

interface LessonFormProps {
  lesson?: Lesson;
}

export function AdminNewLesson({ lesson }: LessonFormProps) {
  const [isUploaded, setIsUploaded] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [attachmentsToRemove, setAttachmentsToRemove] = useState<number[]>([]);
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

      for (let i = 0; i < files.length; i++) {
        formData.append('newAttachments[]', files[i]);
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
    [lesson, files, attachmentsToRemove]
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
    setFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleRemoveFile = (name: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== name));
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
          className="flex flex-col gap-4 max-w-lg w-full"
          onSubmit={form.handleSubmit(submitForm)}
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

          <p>Dodane załączniki</p>
          {lesson &&
            lesson.attachments &&
            lesson.attachments
              .filter(
                (attachment) => !attachmentsToRemove.includes(attachment.id)
              )
              .map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex justify-between items-center"
                >
                  <Link
                    className="underline"
                    href={attachment.url}
                    target="_blank"
                  >
                    {attachment.name}
                  </Link>
                  <button
                    className="p-1 rounded-md bg-destructive text-destructive-foreground"
                    onClick={() => handleRemoveAttachment(attachment.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </button>{' '}
                </div>
              ))}

          {files.map((file) => (
            <div
              key={file.name}
              className="flex justify-between items-center"
            >
              <Link
                className="underline"
                href={URL.createObjectURL(file)}
                target="_blank"
              >
                {file.name}
              </Link>
              <button
                className="p-1 rounded-md bg-destructive text-destructive-foreground"
                onClick={() => handleRemoveFile(file.name)}
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          ))}
          <Dropzone
            maxFiles={3}
            onDrop={handleDrop}
            onError={console.error}
          >
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>

          {form.formState.errors.root?.serverError && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.root?.serverError.message}
            </p>
          )}
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
        </form>
      </Form>
    </div>
  );
}

export default AdminNewLesson;
