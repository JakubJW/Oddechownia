'use client';

import { adminSignIn } from '@/server/actions/auth';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { formSchema, defaultValues } from '@/features/Login/Form/schema';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null);

    const formData = new FormData();
    formData.append('email', values.email);
    formData.append('password', values.password);

    const { error } = await adminSignIn(formData);

    if (error) {
      return setError(error);
    }

    router.push('/admin');
  };

  return (
    <div className="w-full lg:max-w-[512px] xl:max-w-[640px] 2xl:max-w-[768px] mx-auto py-32 px-4 lg:pr-16 xl:pr-24 2xl:pr-32 self-center">
      <div className="p-8 rounded-xl">
        <h1 className="font-bold text-xl mb-4">Logowanie do panelu admina</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adres e-mail</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hasło</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
            <Link
              className="text-sm text-primaryFg underline"
              href="/admin/zapomnialem-hasla"
            >
              Zapomniałem hasła
            </Link>
            <Button
              size="lg"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              Zaloguj
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
