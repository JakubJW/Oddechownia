'use client';

import { Combobox } from '@/components/combobox';
import FileUpload from '@/components/file-upload';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useFileUpload } from '@/hooks/use-file-upload';
import { formatDateForInput, formatTimeForInput } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { memo, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { updateFormSchema, TUpdateLiveLessonSchema } from './Form/schema';
import { useLiveLessonMutations } from './hooks/useLiveLessonMutations';
import { useStripeProducts } from '@/hooks/use-stripe-products';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SUBSCRIBER_ACCESS } from '@/entities/models/product';
import { Label } from '@/components/ui/label';
import { AdminLiveLessonCardDTO } from '@/entities/models/live-lesson';

const UpdateDialog = ({
  liveLesson,
  open,
  setOpen,
}: {
  liveLesson: AdminLiveLessonCardDTO;
  open: boolean;
  setOpen: (state: boolean) => void;
}) => {
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    undefined
  );
  const { updateMutation } = useLiveLessonMutations();
  const { data } = useStripeProducts();

  const comboboxOptions = useMemo(() => {
    if (!data) return [];

    return data.map((item) => ({
      value: item.defaultPriceId,
      label: item.name,
    }));
  }, [data]);

  const form = useForm({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      ...liveLesson,
      isFree: liveLesson.price === 0,
      priceId: data?.find(
        (product) => product.defaultPriceId === liveLesson.priceId
      )?.defaultPriceId,
      date: formatDateForInput(liveLesson.scheduledAt),
      time: formatTimeForInput(liveLesson.scheduledAt),
    },
    mode: 'all',
  });

  const [date, time, isFree, priceId] = form.watch([
    'date',
    'time',
    'isFree',
    'priceId',
  ]);

  useEffect(() => {
    if (isFree === true) {
      form.setValue('subscriberAccess', SUBSCRIBER_ACCESS.FREE_UNLIMITED);
    } else {
      form.setValue('subscriberAccess', SUBSCRIBER_ACCESS.QUOTA_BASED);
    }
  }, [isFree, form]);

  useEffect(() => {
    const unitAmount = isFree
      ? 0
      : (data?.find((option) => option.defaultPriceId === priceId)?.price ?? 0);

    form.setValue('price', unitAmount);
  }, [data, priceId, isFree, form]);

  const { uploadFiles, isUploading } = useFileUpload({
    bucket: 'public-assets',
    folder: 'thumbnails/live-lessons',
    onSuccess: (ids, previewUrl) => {
      form.setValue('imageId', ids[0]);
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

  useEffect(() => {
    form.setValue('scheduledAt', new Date(`${date}T${time}`).toISOString());
  }, [date, time, form]);

  const onSubmit = async (values: TUpdateLiveLessonSchema) => {
    if (!liveLesson) return;
    updateMutation.mutate(
      { id: liveLesson.id, values },
      {
        onSuccess: () => {
          setOpen(false);
          setImagePreview(undefined);
          form.reset();
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
                name="price"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="priceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Powiązany produkt Stripe</FormLabel>
                      <FormControl>
                        <Combobox
                          defaultValue={field.value}
                          placeholder="Wybierz produkt..."
                          options={comboboxOptions}
                          onChange={field.onChange}
                          isLoading={false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isFree"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="is-free"
                            defaultChecked={false}
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked)
                            }
                          />
                          <Label htmlFor="is-free">Za darmo</Label>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Nie powoduje zużycia darmowych zapisów dla subskrybentów
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="subscriberAccess"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dostęp dla subskrybentów</FormLabel>
                    <FormControl>
                      <RadioGroup
                        disabled={isFree === true}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={SUBSCRIBER_ACCESS.PAID} />
                          </FormControl>
                          <FormLabel className="font-normal">Płatny</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              value={SUBSCRIBER_ACCESS.QUOTA_BASED}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Za kredyty
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
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
                    <FormLabel>Tytuł*</FormLabel>
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
                name="imageId"
                render={() => (
                  <FormItem>
                    <FormLabel>Miniaturka*</FormLabel>
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
                          src={imagePreview ? imagePreview : liveLesson.image}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  name="date"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data*</FormLabel>
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
                      <FormLabel>Godzina*</FormLabel>
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
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Czas trwania (min)*</FormLabel>
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
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opis</FormLabel>
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
                    <FormLabel>Link do spotkania</FormLabel>
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
                    <FormLabel>Link do nagrania</FormLabel>
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
                name="isListed"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is-listed"
                          defaultChecked={!liveLesson.isListed}
                          onCheckedChange={(checked) => field.onChange(checked)}
                        />
                        <Label htmlFor="is-listed">Zapisy zamknięte</Label>
                      </div>
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
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is-completed"
                          defaultChecked={liveLesson?.isCompleted}
                          onCheckedChange={(checked) => field.onChange(checked)}
                        />
                        <Label htmlFor="is-completed">Zajęcia zakończone</Label>
                      </div>
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
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is-published"
                          defaultChecked={liveLesson?.isPublished}
                          onCheckedChange={(checked) => field.onChange(checked)}
                        />
                        <Label htmlFor="is-published">Opublikuj nagranie</Label>
                      </div>
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
