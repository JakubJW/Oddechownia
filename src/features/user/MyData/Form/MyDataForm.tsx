'use client';

import {
  Form,
  FormControl,
  FormMessage,
  FormItem,
  FormLabel,
  FormField,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { formSchema } from './schema';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUser } from '@/server/actions/user';
import { User } from '@/server/actions/user';

const MyDataForm = ({ user }: { user: User }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user!.email,
      regulationsAgreement: user?.regulationsAgreement ?? false,
      privacyPolicyAgreement: user?.privacyPolicyAgreement ?? false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const { error } = await updateUser({ ...values });

    if (error) {
      setError(
        'Podczas aktualizowania danych wystąpił błąd. Spróbuj ponownie później.'
      );
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imię</FormLabel>
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
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwisko</FormLabel>
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
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adres e-mail</FormLabel>
                <FormControl>
                  <Input
                    disabled={true}
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="regulationsAgreement"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex gap-4">
                      <Checkbox
                        id="regulations"
                        checked={field.value}
                        onCheckedChange={(checked: boolean) =>
                          field.onChange(checked)
                        }
                      />
                      <label
                        htmlFor="regulations"
                        className="text-sm font-medium leading-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Akceptuję regulamin serwisu oraz chcę natychmiastowego
                        świadczenia usług i rozumiem, że nie będę mógł od niej
                        odstąpić w terminie 14 dni (wymagane).{' '}
                        <span className="text-red-500">*</span>
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="privacyPolicyAgreement"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex gap-4">
                      <Checkbox
                        id="privacy"
                        checked={field.value}
                        onCheckedChange={(checked: boolean) =>
                          field.onChange(checked)
                        }
                      />
                      <label
                        htmlFor="privacy"
                        className="text-sm font-medium leading-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Oświadczam, że zapoznałem się z Polityką Prywatności w
                        tym z informacją o dobrowolnym charakterze wyrażenia
                        zgody oraz prawie do wycofania zgody w każdym czasie.{' '}
                        <span className="text-red-500">*</span>
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
          </div>
        </div>
        <Button
          size="lg"
          className="w-min"
          disabled={isLoading}
        >
          {isLoading ? 'Ładowanie...' : 'Zatwierdź'}
        </Button>
      </form>
    </Form>
  );
};

export default MyDataForm;
