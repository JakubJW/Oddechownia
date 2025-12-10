'use client';

import { useForgotPasswordMutations } from './hooks/useForgotPasswordMutations';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  setNewPasswordFormDefaultValues,
  setNewPasswordFormSchema,
  SetNewPasswordFormValues,
} from './requestResetPasswordFormSchema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CircleCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const SetNewPasswordForm = () => {
  const { setNewPasswordMutation } = useForgotPasswordMutations();
  const form = useForm({
    resolver: zodResolver(setNewPasswordFormSchema),
    defaultValues: setNewPasswordFormDefaultValues,
  });

  const onSubmit = (values: SetNewPasswordFormValues) => {
    setNewPasswordMutation.mutate(values, {
      onError: () => {
        form.setError('confirmPassword', {
          message: 'Nowe hasło musi być inne, niż stare hasło',
        });
      },
    });
  };

  return (
    <div className="w-full lg:max-w-[512px] xl:max-w-[640px] 2xl:max-w-[768px] ml-auto py-32 px-4 lg:pr-16 xl:pr-24 2xl:pr-32 self-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="space-y-4">
            <p className="text-muted-foreground font-light text-lg mb-4">
              Ustaw nowe hasło
            </p>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nowe hasło</FormLabel>
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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Potwierdź nowe hasło</FormLabel>
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
          <span className="text-sm text-muted-foreground font-light">
            Dzięki magicznemu linkowi nasz system zalogował cię automatycznie.{' '}
            <br />
            Zaktualizuj swoje hasło i zatwierdź formularz.
          </span>
          <Button
            size="lg"
            disabled={
              setNewPasswordMutation.isPending ||
              setNewPasswordMutation.isSuccess
            }
            className={cn(
              'transition-colors duration-300',
              setNewPasswordMutation.isSuccess && 'bg-emerald-500'
            )}
          >
            {setNewPasswordMutation.isSuccess
              ? 'Hasło zostało zmienione, możesz opuścić tę stronę'
              : 'Zatwierdź'}
            {setNewPasswordMutation.isPending && (
              <Loader2 className="size-4 animate-spin mr-1" />
            )}
            {setNewPasswordMutation.isSuccess && (
              <CircleCheck className="size-4 mr-1" />
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
