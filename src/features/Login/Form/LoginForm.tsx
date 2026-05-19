'use client';

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
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { defaultValues, formSchema } from './schema';
import { PasswordInput } from '@/components/password-input';
import { useAuth } from '@/components/AuthProvider';

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const { logIn } = useAuth();
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

    try {
      await logIn(formData);
      router.push('/moje-konto');
    } catch (error) {
      console.log('Error in LoginForm', error);
      setError((error as unknown as Error).message);
    }
  };

  return (
    <div className="flex flex-col justify-center">
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
                  <PasswordInput {...field} />
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
              href="/rejestracja"
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
  );
}
