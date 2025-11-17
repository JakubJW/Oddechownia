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
import { Plus, Loader2 } from 'lucide-react';
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
import { createformSchema, defaultValues } from './Form/schema';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { queryClient } from '@/components/QueryClientProvider';
import { CreateLiveLessonResponse } from '@/server/models/liveLesson.models';
import { toast } from 'sonner';

const createLiveLesson = async (values: z.infer<typeof createformSchema>) => {
  const res = await fetch(`/api/live-lessons/create`, {
    method: 'POST',
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    const errorBody = await res
      .json()
      .catch(() => ({ message: res.statusText }));

    throw new Error(
      `Failed to fetch comments (Status ${res.status}): ${
        errorBody.message || 'Unknown error'
      }`
    );
  }

  const json = await res.json();
  return json.data as CreateLiveLessonResponse;
};

const CreateUpdateDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(createformSchema),
    defaultValues,
    mode: 'all',
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof createformSchema>) =>
      createLiveLesson(values),
    onSuccess: () => {
      setDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['live-lessons'] });
    },
    onError: (error) => toast.error(error.message),
  });

  const [date, time] = form.watch(['date', 'time']);

  useEffect(() => {
    if (!date || !time) return;
    
    form.setValue('scheduledAt', new Date(`${date}T${time}`).toISOString());
  }, [date, time, form]);

  const onSubmit = async (values: z.infer<typeof createformSchema>) => {
    mutation.mutate({ ...values });
  };

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
    >
      <Form {...form}>
        <form
          id="live-lesson-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <DialogTrigger asChild>
            <Button type="button">
              <Plus className="h-4 w-4 mr-2" />
              Dodaj zajęcia
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
                name="scheduledAt"
                render={({ field }) => (
                  <FormItem>
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
                form="live-lesson-form"
              >
                {mutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  'Utwórz zajęcia'
                )}
              </Button>
            </div>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
};

export default CreateUpdateDialog;
