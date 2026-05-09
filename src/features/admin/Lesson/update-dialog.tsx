import FileUpload from '@/components/file-upload';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { useFileUpload } from '@/hooks/use-file-upload';
import { zodResolver } from '@hookform/resolvers/zod';
import MuxUploader from '@mux/mux-uploader-react';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Labels } from './Form/Labels';
import { updateFormSchema, UpdateLessonValues } from './Form/schema';
import { useLessonMutations } from './hooks/use-lesson-mutations';
import { AdminEditLessonDTO } from '@/server/models/lesson.models';
import MuxPlayer from '@mux/mux-player-react';
import { useVideoMutations } from '../Video/hooks/use-video-mutations';

export const UpdateLessonDialog = ({
  lesson,
  open,
  setOpen,
}: {
  lesson: AdminEditLessonDTO;
  open: boolean;
  setOpen: (state: boolean) => void;
}) => {
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    undefined
  );
  const { updateMutation, deleteMutation } = useLessonMutations();
  const { deleteMutation: deleteVideoMutation } = useVideoMutations();

  const { isUploading, uploadFiles } = useFileUpload({
    bucket: 'public-assets',
    folder: 'thumbnails/lessons',
    onSuccess: (ids, previewUrl) => {
      setImagePreview(previewUrl);
      form.setValue('thumbnailId', ids[0]);
    },
  });

  const form = useForm<UpdateLessonValues>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      ...lesson,
      labelIds: lesson.labels.map((l) => l.id),
    },
    mode: 'all',
  });

  const onSubmit = async (values: UpdateLessonValues) => {
    updateMutation.mutate({ id: lesson.id, values });
  };

  const handleFilesDrop = async (files: File[]) => {
    await uploadFiles(files);
  };

  useEffect(() => {
    form.reset({ ...lesson, labelIds: lesson.labels.map((l) => l.id) });
    setImagePreview(lesson.thumbnail);
  }, [lesson, form]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <Form {...form}>
        <form
          id="update-lesson-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edytuj lekcję</DialogTitle>
            </DialogHeader>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormItem>
                    <FormLabel>Nazwa</FormLabel>
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
            <FormField
              control={form.control}
              name="thumbnailId"
              render={() => (
                <FormItem>
                  <FormLabel>Miniaturka</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-4">
                      <FileUpload
                        isUploading={isUploading}
                        maxFiles={1}
                        accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
                        onChange={async (files) => await handleFilesDrop(files)}
                      />
                      <img
                        className="aspect-video object-cover rounded-xl"
                        src={imagePreview ? imagePreview : lesson.thumbnail}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="videoId"
              render={({ field }) => (
                <FormItem>
                  <FormItem>
                    <FormLabel>Film</FormLabel>
                    <FormControl>
                      {lesson.video ? (
                        <div>
                          <MuxPlayer
                            className="mb-6 w-full aspect-video rounded-lg overflow-hidden"
                            streamType="on-demand"
                            playbackId={lesson.video.publicPlaybackId}
                            metadata={{
                              video_title: lesson.name,
                              player_name: lesson.name,
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
                                  Tej akcji nie można cofnąć. Aby móc przesłać
                                  kolejny film, odśwież stronę.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <DialogClose asChild>
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
                                  onClick={() =>
                                    deleteVideoMutation.mutate(
                                      lesson.video!.assetId!
                                    )
                                  }
                                >
                                  Zatwierdź
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      ) : (
                        <MuxUploader
                          type="bar"
                          className="w-full mb-6"
                          style={
                            {
                              '--button-border-radius': '40px',
                            } as React.CSSProperties
                          }
                          endpoint={async () => {
                            const { result, error } = await fetch(
                              '/api/mux/create-upload'
                            ).then((res) => res.json());
                            if (error) {
                              return console.error(error);
                            }
                            field.onChange(result.data.id);
                            return result.upload_url;
                          }}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="labelIds"
              render={({ field }) => (
                <FormItem>
                  <FormItem>
                    <FormLabel>Etykiety</FormLabel>
                    <FormControl>
                      <Labels
                        currentLabels={field.value}
                        onRemove={(removedId) => {
                          const remainingLabels = field.value.filter(
                            (id) => id !== removedId
                          );
                          field.onChange(remainingLabels);
                        }}
                        onAdd={(id) => field.onChange([...field.value, id])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormItem>
              )}
            />
            <div className="flex gap-2 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Anuluj
              </Button>
              <Button
                type="submit"
                form="update-lesson-form"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending && (
                  <Loader2 className="animate-spin mr-2" />
                )}
                Zapisz zmiany
              </Button>
            </div>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
};
