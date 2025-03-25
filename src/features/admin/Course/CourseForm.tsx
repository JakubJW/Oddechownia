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
import { useForm } from 'react-hook-form';
import { updateCourse, createCourse } from '@/app/admin/kursy/actions';

interface CourseFormProps {
  course?: Course;
}

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  isPublished: z.boolean(),
});

const initialState = {
  name: '',
  description: '',
  isPublished: false,
};

export default function CourseForm({ course }: CourseFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: course
      ? {
          name: course.name,
          description: course.description,
          isPublished: course.isPublished,
        }
      : initialState,
    mode: 'onChange',
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (course) {
      await updateCourse(course.slug, values);
    } else {
      await createCourse(values);
    }

    router.push(`/admin/kursy`);
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
                <FormLabel>Nazwa kursu</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage></FormMessage>
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
                <FormMessage></FormMessage>
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
        <Button type="submit">
          {course ? 'Zapisz zmiany' : 'Utwórz kurs'}
        </Button>
      </form>
    </Form>
  );
}
