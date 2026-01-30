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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  registerDefaultValues,
  registerFormSchema,
  RegisterFormValues,
} from './registerFormSchema';
import { cn } from '@/lib/utils';
import { useRegisterMutation } from '../hooks/useRegisterMutation';
import { Loader2 } from 'lucide-react';
import { ApiFieldError } from '../hooks/useRegisterMutation';
import { PasswordInput } from '@/components/password-input';

export const RegisterForm = ({ className }: { className?: string }) => {
  const mutation = useRegisterMutation();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: registerDefaultValues,
    mode: 'all',
  });

  const onSubmit = async (values: RegisterFormValues) => {
    mutation.mutate(values, {
      onError: (error) => {
        if (error instanceof ApiFieldError) {
          form.setError(error.field as keyof RegisterFormValues, {
            type: 'manual',
            message: error.message,
          });
        }
      },
    });
  };

  return (
    <div className={cn('', className)}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="font-light text-lg mb-4">Twoje dane</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          className="text-sm font-light leading-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                          className="text-sm font-light leading-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
            disabled={mutation.isPending}
          >
            {mutation.isPending && (
              <Loader2 className="size-4 animate-spin mr-1" />
            )}
            Rozpocznij darmowy okres próbny
          </Button>
        </form>
      </Form>
    </div>
  );
};
