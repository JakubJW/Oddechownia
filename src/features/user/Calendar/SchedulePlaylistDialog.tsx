'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format, addDays } from 'date-fns';
import { pl } from 'date-fns/locale';
import { CalendarIcon, Loader2, Settings2, ListChecks } from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  SchedulePlaylistSchema,
  ScheduleIntervals,
  SchedulePlaylistInput,
} from '@/server/models/practiceSchedule.models';

// Helper type for the lessons passed into this component
interface PlaylistLessonSummary {
  lessonId: number;
  title: string;
  duration: number;
}

interface SchedulePlaylistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlistId: number;
  playlistName: string;
  lessons: PlaylistLessonSummary[]; // Passed from parent
}

export function SchedulePlaylistDialog({
  open,
  onOpenChange,
  playlistId,
  playlistName,
  lessons,
}: SchedulePlaylistDialogProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'automatic' | 'manual'>(
    'automatic'
  );

  const form = useForm<SchedulePlaylistInput>({
    resolver: zodResolver(SchedulePlaylistSchema),
    defaultValues: {
      mode: 'automatic',
      playlistId: playlistId,
      startDate: new Date(),
      startTime: '18:00',
      interval: ScheduleIntervals.DAILY,
      lessons: lessons.map((l) => ({
        lessonId: l.lessonId,
        lessonTitle: l.title,
        scheduledAt: new Date(),
        included: true,
      })),
    } as any,
  });

  useEffect(() => {
    form.setValue('mode', activeTab);
  }, [activeTab, form]);

  const { fields, update } = useFieldArray({
    control: form.control,
    name: 'lessons' as never,
  });

  const mutation = useMutation({
    mutationFn: async (values: SchedulePlaylistInput) => {
      const response = await fetch('/api/calendar/schedule-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to schedule');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      toast.success('Plan zapisany', {
        description: `Zaplanowano ${data.count} lekcji z playlisty "${playlistName}".`,
      });
      onOpenChange(false);
      form.reset();
    },
    onError: () => {
      toast.error('Błąd podczas planowania');
    },
  });

  const onSubmit = (values: SchedulePlaylistInput) => {
    mutation.mutate(values);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Zaplanuj playlistę: {playlistName}</DialogTitle>
          <DialogDescription>
            Wybierz tryb automatyczny lub ustaw daty ręcznie.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as any)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="automatic">
              <Settings2 className="w-4 h-4 mr-2" /> Automatycznie
            </TabsTrigger>
            <TabsTrigger value="manual">
              <ListChecks className="w-4 h-4 mr-2" /> Ręcznie
            </TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {/* --- COMMON FIELDS --- */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        Data{' '}
                        {activeTab === 'automatic' ? 'rozpoczęcia' : 'bazowa'}
                      </FormLabel>
                      <Popover modal>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
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
                            onSelect={(date) => {
                              field.onChange(date);
                              // Optional: Update manual list dates if date changes
                              if (activeTab === 'manual' && date) {
                                lessons.forEach((_, idx) => {
                                  // update is tricky with TS here, using setValue loop might be safer
                                  form.setValue(
                                    `lessons.${idx}.scheduledAt`,
                                    date
                                  );
                                });
                              }
                            }}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            locale={pl}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Godzina</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* --- AUTOMATIC MODE --- */}
              <TabsContent
                value="automatic"
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="interval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Częstotliwość</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Wybierz interwał" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={ScheduleIntervals.DAILY}>
                            Codziennie
                          </SelectItem>
                          <SelectItem value={ScheduleIntervals.EVERY_OTHER_DAY}>
                            Co drugi dzień
                          </SelectItem>
                          <SelectItem value={ScheduleIntervals.WEEKLY}>
                            Raz w tygodniu
                          </SelectItem>
                          <SelectItem value={ScheduleIntervals.WORK_DAYS}>
                            W dni robocze (Pn-Pt)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-muted/30 p-4 rounded-lg text-sm text-muted-foreground">
                  System automatycznie zaplanuje{' '}
                  <strong>{lessons.length}</strong> lekcji zaczynając od
                  wybranej daty.
                </div>
              </TabsContent>

              {/* --- MANUAL MODE --- */}
              <TabsContent
                value="manual"
                className="space-y-2 max-h-[300px] overflow-y-auto pr-2"
              >
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-3 border-b pb-2 mb-2 last:border-0"
                  >
                    <FormField
                      control={form.control}
                      name={`lessons.${index}.included`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex-1 text-sm font-medium truncate">
                      {/* @ts-ignore - dynamic access */}
                      {form.getValues(`lessons.${index}.lessonTitle`)}
                    </div>

                    <FormField
                      control={form.control}
                      name={`lessons.${index}.scheduledAt`}
                      render={({ field }) => (
                        <FormItem className="shrink-0">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                  'w-[130px] justify-start text-left font-normal text-xs',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value
                                  ? format(field.value, 'd MMM yyyy', {
                                      locale: pl,
                                    })
                                  : 'Data'}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                locale={pl}
                              />
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </TabsContent>

              <DialogFooter>
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Zaplanuj playlistę
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
