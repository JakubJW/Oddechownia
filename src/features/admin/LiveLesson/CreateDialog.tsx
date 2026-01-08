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
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FileUpload from '@/components/file-upload';
import { createformSchema, defaultValues } from './Form/schema';
import { useLiveLessonMutations } from './hooks/useLiveLessonMutations';
import { useImageCompression } from '@/hooks/useImageCompression';
import { createClient } from '@/supabase/client';

const CreateUpdateDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { createMutation } = useLiveLessonMutations();
  const { compress } = useImageCompression();
  const form = useForm({
    resolver: zodResolver(createformSchema),
    defaultValues,
    mode: 'all',
  });

  const [date, time] = form.watch(['date', 'time']);

  useEffect(() => {
    if (!date || !time) return;

    form.setValue('scheduledAt', new Date(`${date}T${time}`).toISOString());
  }, [date, time, form]);

  const onSubmit = async (values: z.infer<typeof createformSchema>) => {
    createMutation.mutate(values);
  };

  const handleFilesDrop = async (files: File[]) => {
    //1. compress files
    const compressed = await Promise.all(
      files.map(async (file) => await compress(file))
    );

    //2. create initial rows in files table and return signed upload urls
    const payload = compressed.map((blob, index) => {
      const originalFile = files[index];
      const name = originalFile.name.replace(/\.[^/.]+$/, '') + '.webp';
      return { name, type: blob.type };
    });

    const res = await fetch('/api/files/upload/prepare', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    //3. upload files directly to supabase
    const supabase = createClient();
    const uploadPromises = json.data.map(async (item, index) => {
      const fileToUpload = compressed[index];
      const result = await supabase.storage
        .from('public-assets')
        .uploadToSignedUrl(item.path, item.token, fileToUpload);

      return result;
    });

    const response = await Promise.all(uploadPromises);

    //4. update initial rows with final data after success

    //5. return created file ids to include them in form submission
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
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Miniaturka</FormLabel>
                    <FormControl>
                      <FileUpload
                        onChange={async (files) => await handleFilesDrop(files)}
                        maxFiles={2}
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
                {createMutation.isPending ? (
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
