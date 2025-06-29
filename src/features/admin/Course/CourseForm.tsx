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
import { Course } from '@/db/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { updateCourse, createCourse } from '@/actions/course';
import { formSchema, defaultValues } from './schema';
import { useState } from 'react';

interface CourseFormProps {
  course?: Course;
}

export default function CourseForm({ course }: CourseFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: course
      ? {
          name: course.name,
          description: course.description,
          isPublished: course.isPublished,
          priceInCents: course.priceInCents ?? 0,
          isOneOff: course.isOneOff,
        }
      : defaultValues,
    mode: 'all',
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!course) {
      setIsLoading(true);
      const { data, success, error } = await createCourse(values);
      setIsLoading(false);
      
      if (!success) {
        return setError(error);
      }

      return router.push(`/admin/kurs/${data.slug}`);
    }

    setIsLoading(true);
    const { success, error } = await updateCourse(course.slug, values);
    setIsLoading(false);

    if (!success) {
      return setError(error);
    }
  };

  const isOneOff = useWatch({
    control: form.control,
    name: 'isOneOff',
  });

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
                <FormLabel>Nazwa kursu</FormLabel>
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
          name="isOneOff"
          render={({ field }) => (
            <FormItem>
              <FormItem>
                <FormControl>
                  <div className="flex gap-4">
                    <Checkbox
                      id="isOneOff"
                      checked={field.value}
                      onCheckedChange={(checked: boolean) =>
                        field.onChange(checked)
                      }
                    />
                    <label
                      htmlFor="isOneOff"
                      className="text-sm font-medium leading-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Zakup jednorazowy
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormItem>
          )}
        />
        {isOneOff && (
          <FormField
            control={form.control}
            name="priceInCents"
            render={({ field }) => (
              <FormItem>
                <FormItem>
                  <FormLabel>Cena (w groszach)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormItem>
            )}
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
        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading
            ? 'Ładowanie...'
            : course
            ? 'Zapisz zmiany'
            : 'Utwórz kurs'}
        </Button>
      </form>
    </Form>
  );
}
