'use client';

import {
  createLesson,
  removeLesson,
  updateLesson,
} from '@/server/actions/lesson';
import { deleteVideo } from '@/server/actions/video';
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
import { AdminEditLessonDTO } from '@/server/models/lesson.models';
import { Info } from 'lucide-react';
import {
  DialogHeader,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface LessonFormProps {
  lesson?: AdminEditLessonDTO;
}

export function AdminNewLesson({ lesson }: LessonFormProps) {
  const [newAttachments, setNewAttachments] = useState<File[]>([]);
  const [attachmentsToRemove, setAttachmentsToRemove] = useState<number[]>([]);
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

  const handleRemoveVideo = async (lesson: AdminEditLessonDTO) => {
    if (!lesson || !lesson.video || !lesson.video.assetId) return;

    await deleteVideo(lesson.video.assetId);

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
        console.log(error);
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
              currentThumbnailUrl={lesson?.thumbnail}
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="border-red-500 bg-red-500 text-red-100"
                        type="button"
                      >
                        Usuń film
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Czy na pewno chcesz usunąć film?
                        </DialogTitle>
                        <DialogDescription>
                          Tej akcji nie można cofnąć. Aby móc przesłać kolejny
                          film, odśwież stronę.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose>
                          <Button
                            variant="outline"
                            type="button"
                            className="border-border text-muted-foreground bg-muted"
                          >
                            Anuluj
                          </Button>
                        </DialogClose>
                        <Button
                          type="button"
                          variant="outline"
                          className="border-red-500 bg-red-500 text-red-100"
                          onClick={async () => await handleRemoveVideo(lesson)}
                        >
                          Zatwierdź
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              ) : (
                <>
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
                      {
                        '--button-border-radius': '40px',
                      } as React.CSSProperties
                    }
                    className="w-full mb-6"
                  />
                  <span className="text-sm mt-2 flex items-center text-muted-foreground">
                    <Info className="h-4 w-4 mr-2" />
                    Aby uniknąć powstawaniu osieroconych filmów, najpierw utwórz
                    lekcję, a dopiero potem prześlij wideo.
                  </span>
                </>
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="border-red-500 bg-red-500 text-red-100"
                      type="button"
                    >
                      Usuń lekcję
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Czy na pewno chcesz usunąć lekcję?
                      </DialogTitle>
                      <DialogDescription>
                        Tej akcji nie można cofnąć. Usunięta lekcja zniknie ze
                        wszystkich playlist, do których jest dodana, a także z
                        ulubionych lekcji użytkowników oraz ich kalendarzy.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose>
                        <Button
                          variant="outline"
                          type="button"
                          className="border-border text-muted-foreground bg-muted"
                        >
                          Anuluj
                        </Button>
                      </DialogClose>
                      <Button
                        type="button"
                        variant="outline"
                        className="border-red-500 bg-red-500 text-red-100"
                        onClick={async () =>
                          await handleRemoveLesson(lesson.id)
                        }
                      >
                        Zatwierdź
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default AdminNewLesson;
