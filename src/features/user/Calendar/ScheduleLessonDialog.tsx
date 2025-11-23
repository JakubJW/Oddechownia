import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { CalendarIcon, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const FormSchema = z.object({
  date: z.date({
    required_error: 'Data jest wymagana.',
  }),
  time: z
    .string()
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      'Podaj godzinę w formacie HH:MM'
    ),
});

interface ScheduleLessonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lessonId: number;
  playlistId?: number;
  defaultTitle: string;
}

export function ScheduleLessonDialog({
  open,
  onOpenChange,
  lessonId,
  playlistId,
  defaultTitle,
}: ScheduleLessonDialogProps) {
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      time: '18:00', // Default time suggestion
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof FormSchema>) => {
      const [hours, minutes] = values.time.split(':').map(Number);
      const finalDate = new Date(values.date);
      finalDate.setHours(hours);
      finalDate.setMinutes(minutes);

      const response = await fetch('/api/calendar/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId,
          playlistId,
          scheduledAt: finalDate.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to schedule lesson');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate TanStack Query Cache
      // queryClient.invalidateQueries({ queryKey: ['calendar'] });

      toast.success('Zajęcia zaplanowane', {
        description: `Dodano "${defaultTitle}" do Twojego kalendarza.`,
      });
      onOpenChange(false);
      form.reset();
    },
    onError: () => {
      toast.error('Wystąpił błąd');
    },
  });

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    mutation.mutate(values);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Zaplanuj praktykę</DialogTitle>
          <DialogDescription>
            Wybierz termin, w którym chcesz wykonać lekcję{' '}
            <strong>"{defaultTitle}"</strong>.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            {/* 1. Date Picker */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data</FormLabel>
                  <Popover
                    open={datePopoverOpen}
                    onOpenChange={setDatePopoverOpen}
                    modal
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP', { locale: pl })
                          ) : (
                            <span>Wybierz datę</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        } // Disable past dates
                        locale={pl}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 2. Time Input */}
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Godzina</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                disabled={mutation.isPending}
              >
                {mutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Zapisz w kalendarzu
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
