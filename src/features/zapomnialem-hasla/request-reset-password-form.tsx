'use client';

import { useForgotPasswordMutations } from './hooks/useForgotPasswordMutations';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  requestPasswordResetFormSchema,
  RequestPasswordResetFormValues,
  requestPasswordResetFormDefaultValues,
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

export const RequestPasswordResetForm = () => {
  const { requestPasswordResetMutaion } = useForgotPasswordMutations();
  const form = useForm({
    resolver: zodResolver(requestPasswordResetFormSchema),
    defaultValues: requestPasswordResetFormDefaultValues,
  });

  const onSubmit = (values: RequestPasswordResetFormValues) => {
    requestPasswordResetMutaion.mutate(values);
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
              Zapomniałem hasła
            </p>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
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
          {requestPasswordResetMutaion.isSuccess && (
            <span className="text-muted-foreground text-sm">
              Jeśli podany adres e-mail znajduje się w naszej bazie danych,
              zostanie na niego wysłany link do zmiany hasła. <br />
              <br /> Możesz opuścić tę stronę.
            </span>
          )}
          <Button
            size="lg"
            className={cn(
              'transition-colors duration-300',
              requestPasswordResetMutaion.isSuccess && 'bg-emerald-500'
            )}
            disabled={
              requestPasswordResetMutaion.isPending ||
              requestPasswordResetMutaion.isSuccess
            }
          >
            {requestPasswordResetMutaion.isSuccess ? 'Suckes' : 'Zatwierdź'}
            {requestPasswordResetMutaion.isPending && (
              <Loader2 className="size-4 animate-spin mr-1" />
            )}
            {requestPasswordResetMutaion.isSuccess && (
              <CircleCheck className="size-4 animate-spin mr-1" />
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
