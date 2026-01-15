'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { formatDateForInput, formatTimeForInput } from '@/lib/utils';
import { AdminLiveLessonRecordDTO } from '@/server/models/liveLesson.models';
import { zodResolver } from '@hookform/resolvers/zod';
import { memo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { updateFormSchema, UpdateLiveLessonValues } from './Form/schema';
import { useLiveLessonMutations } from './hooks/useLiveLessonMutations';
import FileUpload from '@/components/file-upload';
import { useFileUpload } from '@/hooks/use-file-upload';

const UpdateDialog = ({
  liveLesson,
  open,
  setOpen,
}: {
  liveLesson: AdminLiveLessonRecordDTO;
  open: boolean;
  setOpen: (state: boolean) => void;
}) => {
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    undefined
  );
  const { updateMutation } = useLiveLessonMutations();

  const form = useForm({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      ...liveLesson,
      date: formatDateForInput(liveLesson.scheduledAt),
      time: formatTimeForInput(liveLesson.scheduledAt),
    },
    mode: 'all',
  });

  const { uploadFiles, isUploading } = useFileUpload({
    bucket: 'public-assets',
    folder: 'thumbnails/live-lessons',
    onSuccess: (ids, previewUrl) => {
      form.setValue('thumbnailId', ids[0]);
      setImagePreview(previewUrl);
    },
    onError: (err) => {
      alert('Upload failed: ' + err.message);
    },
  });

  useEffect(() => {
    form.reset({
      ...liveLesson,
      date: formatDateForInput(liveLesson.scheduledAt),
      time: formatTimeForInput(liveLesson.scheduledAt),
    });
  }, [liveLesson, form]);

  const [date, time] = form.watch(['date', 'time']);

  useEffect(() => {
    form.setValue('scheduledAt', new Date(`${date}T${time}`).toISOString());
  }, [date, time, form]);

  const onSubmit = async (values: UpdateLiveLessonValues) => {
    if (!liveLesson) return;
    updateMutation.mutate(
      { id: liveLesson.id, values },
      {
        onSuccess: () => {
          setOpen(false);
          setImagePreview(undefined);
        },
      }
    );
  };

  const handleFilesDrop = async (files: File[]) => {
    await uploadFiles(files);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <Form {...form}>
        <form
          id="update-live-lesson-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edytuj zajęcia na żywo</DialogTitle>
              <DialogDescription>
                Edytuj informacje o nadchodzących zajęciach na żywo.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <FormField
                control={form.control}
                name="scheduledAt"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input
                        type="string"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tytuł</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="np. Poranny Vinyasa Flow"
                      />
                    </FormControl>
                    <FormMessage />
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
                          onChange={async (files) =>
                            await handleFilesDrop(files)
                          }
                        />
                        <img
                          className="aspect-video object-cover rounded-xl"
                          src={
                            imagePreview ? imagePreview : liveLesson.thumbnail
                          }
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="date"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Godzina</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="time"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Czas trwania (minuty)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          field.onChange(Number(value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opis (opcjonalnie)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        placeholder="Krótki opis zajęć..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="meetingLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link do spotkania (opcjonalnie)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://zoom.us/..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="recordingUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link do nagrania (opcjonalnie)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://zoom.us/..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isCompleted"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zajęcia zakończone</FormLabel>
                    <FormControl>
                      <Switch
                        defaultChecked={liveLesson?.isCompleted}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isListed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zamknij zapisy (ukryj publicznie)</FormLabel>
                    <FormControl>
                      <Switch
                        defaultChecked={liveLesson?.isListed}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Opublikuj nagranie (pokaż w historycznych)
                    </FormLabel>
                    <FormControl>
                      <Switch
                        defaultChecked={liveLesson?.isPublished}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Anuluj
              </Button>
              <Button
                type="submit"
                form="update-live-lesson-form"
              >
                Zapisz zmiany
              </Button>
            </div>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
};

export default memo(UpdateDialog);
