'use client';

import FileUpload from '@/components/file-upload';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
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
import { Info, Loader2, Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Labels } from './Form/Labels';
import {
  createformSchema,
  CreateLessonValues,
  defaultValues,
} from './Form/schema';
import { useLessonMutations } from './hooks/use-lesson-mutations';

export function CreateLessonDialog() {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    undefined
  );
  const { createMutation } = useLessonMutations();

  const { isUploading, uploadFiles } = useFileUpload({
    bucket: 'public-assets',
    folder: 'thumbnails/lessons',
    onSuccess: (ids, previewUrl) => {
      setImagePreview(previewUrl);
      form.setValue('thumbnailId', ids[0]);
    },
  });

  const form = useForm<CreateLessonValues>({
    resolver: zodResolver(createformSchema),
    defaultValues,
    mode: 'all',
  });

  const onSubmit = async (values: CreateLessonValues) => {
    createMutation.mutate(values);
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
          id="lesson-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <DialogTrigger asChild>
            <Button type="button">
              <Plus className="h-4 w-4 mr-2" />
              Dodaj lekcję
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Utwórz nową lekcję</DialogTitle>
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
                        src={imagePreview}
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
                      <div>
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
                        <span className="text-sm mt-2 flex items-center text-muted-foreground">
                          <Info className="h-4 w-4 mr-2" />
                          Aby uniknąć powstawaniu osieroconych filmów, najpierw
                          utwórz lekcję, a dopiero potem prześlij wideo.
                        </span>
                      </div>
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
                form="lesson-form"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending && (
                  <Loader2 className="animate-spin mr-2" />
                )}
                Utwórz lekcję
              </Button>
            </div>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}

export default CreateLessonDialog;
