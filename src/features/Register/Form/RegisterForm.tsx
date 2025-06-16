'use client';

import { signup } from '@/app/rejestracja/actions';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { defaultValues, formSchema } from './schema';

export default function RegisterForm({
  stripeProductId,
}: {
  stripeProductId: string;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'all',
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('passwordConfirmation', values.passwordConfirmation);
    formData.append('firstName', values.firstName);
    formData.append('lastName', values.lastName);
    formData.append(
      'regulationsAgreement',
      String(values.regulationsAgreement)
    );
    formData.append(
      'privacyPolicyAgreement',
      String(values.privacyPolicyAgreement)
    );
    formData.append('stripeProductId', stripeProductId);

    const { data, error } = await signup(formData, stripeProductId);

    window.location.href = data;
  };

  return (
    <div className="col-span-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="mt-6 space-y-6">
            <div className="space-y-4">
              <p className="font-bold text-xl mb-4">Twoje dane</p>
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
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
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
                <FormField
                  control={form.control}
                  name="passwordConfirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Powtórz hasło</FormLabel>
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
              </div>
            </div>
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
            </div>
          </div>
          <Button
            size="lg"
            disabled={!form.formState.isValid}
          >
            Zatwierdź
          </Button>
        </form>
      </Form>
    </div>
  );
}
