import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, PlusCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { usePlaylists } from '@/features/admin/user-practice-schedule/hooks/use-playlists';
import { useUserPracticeScheduleMutations } from '@/features/admin/user-practice-schedule/hooks/use-user-practice-schedule-mutations';
import { UserPracticeScheduleInsert } from '@/entities/models/user-practice-schedule';

const createUserScheduleFormSchema = z
  .object({
    scheduledAt: z.string(),
    lessonId: z.number(),
    playlistId: z.number(),
  })
  .superRefine(({ lessonId, playlistId }, ctx) => {
    if (!playlistId) {
      ctx.addIssue({ path: ['playlistId'], code: 'custom', message: 'chuj' });
    }

    if (!lessonId) {
      ctx.addIssue({ path: ['lessonId'], code: 'custom', message: 'chuj' });
    }
  });

export function ScheduleLessonDialog({ scheduledAt }: { scheduledAt: string }) {
  const { data: playlistsData, isLoading, isError } = usePlaylists();
  const { createMutation } = useUserPracticeScheduleMutations();
  const form = useForm({
    resolver: zodResolver(createUserScheduleFormSchema),
    defaultValues: {
      scheduledAt,
    },
  });

  const [playlistId] = form.watch(['playlistId']);

  const playlists = playlistsData ?? [];
  const selectedPlaylist = playlists.find((p) => p.id === Number(playlistId));
  const lessons = selectedPlaylist?.lessons ?? [];

  const onSubmit = (values: z.infer<typeof createUserScheduleFormSchema>) => {
    createMutation.mutate(values);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button
          asChild
          size="icon"
        >
          <PlusCircle />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Zaplanuj praktykę</DialogTitle>
          <DialogDescription>
            Wybierz lekcję, która ma zostać wykonana w tym terminie
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="playlistId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Playlista</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value?.toString() ?? ''}
                      onValueChange={(val) => {
                        field.onChange(Number(val));
                        form.resetField('lessonId');
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz playlistę" />
                      </SelectTrigger>
                      <SelectContent>
                        {playlists.map(({ name, id }) => (
                          <SelectItem
                            key={id}
                            value={String(id)}
                          >
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lessonId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lekcja</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value?.toString() ?? ''}
                      disabled={!playlistId || lessons.length === 0}
                      onValueChange={(val) => field.onChange(Number(val))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz lekcję" />
                      </SelectTrigger>
                      <SelectContent>
                        {lessons.map(({ name, id }) => (
                          <SelectItem
                            key={id}
                            value={String(id)}
                          >
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Zapisz
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
