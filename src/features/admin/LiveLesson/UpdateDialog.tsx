'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Edit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateFormSchema } from './Form/schema';
import { z } from 'zod';
import { useState } from 'react';
import { queryClient } from '@/components/QueryClientProvider';
import { Switch } from '@/components/ui/switch';
import { AdminLiveLessonRecordDTO } from '@/server/models/liveLesson.models';
import { formatTimeForInput, formatDateForInput } from '@/lib/utils';

const update = async (id: string, values: z.infer<typeof updateFormSchema>) => {
  const res = await fetch(`/api/live-lessons/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(values),
  });

  const json = await res.json();
  return json.data as UpdateLiveLessonResponse;
};

const CreateUpdateDialog = ({
  liveLesson,
}: {
  liveLesson: AdminLiveLessonRecordDTO;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      ...liveLesson,
      date: formatDateForInput(liveLesson.scheduledAt),
      time: formatTimeForInput(liveLesson.scheduledAt),
    },
    mode: 'all',
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof updateFormSchema>) =>
      update(liveLesson.id, values),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['live-lessons'] }),
  });

  const onSubmit = async (values: z.infer<typeof updateFormSchema>) => {
    mutation.mutate({ ...values });
  };

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
    >
      <Form {...form}>
        <form
          id="update-live-lesson-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <DialogTrigger asChild>
            <Button
              type="button"
              className="rounded-full"
              variant="ghost"
              size="icon"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Utwórz nowe zajęcia na żywo</DialogTitle>
              <DialogDescription>
                Dodaj informacje o nadchodzących zajęciach na żywo.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
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
                        defaultChecked={liveLesson.isCompleted}
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
                        defaultChecked={liveLesson.isListed}
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
                        defaultChecked={liveLesson.isPublished}
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
                onClick={() => setDialogOpen(false)}
              >
                Anuluj
              </Button>
              <Button
                type="submit"
                form="update-live-lesson-form"
              >
                Utwórz zajęcia
              </Button>
            </div>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
};

export default CreateUpdateDialog;
