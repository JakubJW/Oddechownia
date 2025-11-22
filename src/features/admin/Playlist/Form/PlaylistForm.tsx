'use client';

import { createPlaylist, updatePlaylist } from '@/server/actions/playlist';
import { deleteVideo } from '@/server/actions/video';
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
import { useActionResult } from '@/hooks/useActionResult';
import { zodResolver } from '@hookform/resolvers/zod';
import MuxPlayer from '@mux/mux-player-react';
import MuxUploader from '@mux/mux-uploader-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { defaultValues, formSchema, PlaylistFormValues } from './schema';
import { AdminPlaylistDTO } from '@/server/models/playlist.models';

export default function PlaylistForm({
  playlist,
}: {
  playlist?: AdminPlaylistDTO;
}) {
  const router = useRouter();
  const [isUploaded, setIsUploaded] = useState(false);
  const form = useForm<PlaylistFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: playlist ? { ...playlist } : defaultValues,
    mode: 'all',
  });

  const handleFormSubmissionAction = useCallback(
    async (values: PlaylistFormValues) => {
      if (playlist) {
        return updatePlaylist(playlist.slug, values);
      }

      return createPlaylist(values);
    },
    [playlist]
  );

  const { execute: submitForm, isLoading } = useActionResult(
    handleFormSubmissionAction,
    {
      onSuccess: () => {
        router.push(`/admin/playlisty`);
      },
      onError: (error) => {
        form.setError('root.serverError', { type: 'server', message: error });
      },
    }
  );

  const handleRemoveVideo = async (uploadId?: string) => {
    if (!uploadId) return;

    await deleteVideo(uploadId);
  };

  return (
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
        {playlist && playlist.video ? (
          <>
            <MuxPlayer
              className="mb-6 w-full aspect-video rounded-lg overflow-hidden"
              streamType="on-demand"
              playbackId={playlist.video.publicPlaybackId ?? undefined}
              metadata={{
                video_title: playlist.name,
                player_name: 'Video Course Starter Kit',
              }}
            />
            <Button
              type="button"
              onClick={async () =>
                await handleRemoveVideo(playlist.video?.uploadId)
              }
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
            style={{ '--button-border-radius': '40px' } as React.CSSProperties}
            onSuccess={() => setIsUploaded(true)}
            className="w-full mb-6"
          />
        )}
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
        <FormField
          control={form.control}
          name="isAccessibleForFree"
          render={({ field }) => (
            <FormItem>
              <FormItem>
                <FormControl>
                  <div className="flex gap-4">
                    <Checkbox
                      id="accessible-for-free"
                      checked={field.value}
                      onCheckedChange={(checked: boolean) =>
                        field.onChange(checked)
                      }
                    />
                    <label
                      htmlFor="accessible-for-free"
                      className="text-sm font-medium leading-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Dostępna za darmo
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormItem>
          )}
        />
        {form.formState.errors.root?.serverError && (
          <p className="text-sm font-medium text-destructive">
            {form.formState.errors.root?.serverError.message}
          </p>
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
