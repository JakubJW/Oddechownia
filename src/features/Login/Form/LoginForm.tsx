'use client';

import { login } from '@/app/rejestracja/actions';
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
import { formSchema, defaultValues } from './schema';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null);

    const formData = new FormData();
    formData.append('email', values.email);
    formData.append('password', values.password);

    const { error } = await login(formData);

    if (error) {
      console.log('Error in LoginForm', error);
      return setError(error);
    }

    router.push('/moje-konto');
  };

  return (
    <div className="w-full lg:max-w-[512px] xl:max-w-[640px] 2xl:max-w-[768px] ml-auto py-32 px-4 lg:pr-16 xl:pr-24 2xl:pr-32 self-center">
      <div className="p-8 rounded-xl">
        <h1 className="font-bold text-xl mb-4">Logowanie</h1>
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
            <p className="text-sm">
              Jesteś nowym użytkownikem? &nbsp;
              <Link
                className="text-sm text-primaryFg underline self-end"
                href="/dolacz-do-nas"
              >
                Dołącz już teraz!
              </Link>
            </p>
            <Link
              className="text-sm text-primaryFg underline"
              href="/zapomnialem-hasla"
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
