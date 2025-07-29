'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { updatePlaylist, createPlaylist } from '@/actions/playlist';
import { formSchema, defaultValues } from './schema';
import { useState } from 'react';
import { Playlist } from '@/db/types';

export default function PlaylistForm({ playlist }: { playlist?: Playlist }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: playlist
      ? {
          name: playlist.name,
          description: playlist.description,
          isPublished: playlist.isPublished,
        }
      : defaultValues,
    mode: 'all',
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!playlist) {
      setIsLoading(true);
      const { success, error } = await createPlaylist(values);
      setIsLoading(false);

      if (!success) {
        return setError(error);
      }

      return router.push(`/admin/playlisty`);
    }

    setIsLoading(true);
    const { success, error } = await updatePlaylist(playlist.slug, values);
    setIsLoading(false);

    if (!success) {
      return setError(error);
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 max-w-lg w-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
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
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isPublished"
          render={({ field }) => (
            <FormItem>
              <FormItem>
                <FormControl>
                  <div className="flex gap-4">
                    <Checkbox
                      id="published"
                      checked={field.value}
                      onCheckedChange={(checked: boolean) =>
                        field.onChange(checked)
                      }
                    />
                    <label
                      htmlFor="published"
                      className="text-sm font-medium leading-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Opublikuj
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormItem>
          )}
        />
        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading
            ? 'Ładowanie...'
            : playlist
            ? 'Zapisz zmiany'
            : 'Utwórz playlistę'}
        </Button>
      </form>
    </Form>
  );
}
