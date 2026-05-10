'use client';

import { signInToWaitlist } from '@/server/actions/waitlist';
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
import { Label } from '@/components/ui/label';
import { useActionResult } from '@/hooks/useActionResult';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { defaultValues, formSchema } from './schema';

export default function WaitlistForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const {
    isSuccess,
    isLoading,
    execute: submitForm,
  } = useActionResult(signInToWaitlist, {
    onSuccess: () => {
      form.reset();
    },
    onError: (error) => {
      form.setError('root.serverError', { type: 'server', message: error });
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    submitForm(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-4"
      >
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
          name="emailMarketingAgreement"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="emailMarketingAgreement"
                    checked={field.value}
                    onCheckedChange={(checked: boolean) =>
                      field.onChange(checked)
                    }
                  />
                  <Label
                    htmlFor="emailMarketingAgreement"
                    className="text-black font-light text-xs leading-relaxed"
                  >
                    Wyrażam zgodę na otrzymywanie od Tusz Obok (Oddechownia
                    studio jogi) informacji handlowych i marketingowych drogą
                    elektroniczną, zgodnie z ustawą o świadczeniu usług drogą
                    elektroniczną. <span className="text-red-500">*</span>
                  </Label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className={cn(
            'w-full transition-colors',
            isSuccess && 'bg-green-600'
          )}
          disabled={isLoading || isSuccess}
        >
          {isLoading
            ? 'Ładowanie...'
            : isSuccess
              ? 'Dziękuję, jesteśmy w kontakcie!'
              : 'Zapisz się!'}
        </Button>
        {form.formState.errors.root?.serverError && (
          <p className="text-sm font-medium text-destructive">
            {form.formState.errors.root.serverError.message}
          </p>
        )}
      </form>
      <p className="text-xs font-light leasing-relaxed">
        Administratorem Twoich danych osobowych jest Tusz Obok (działająca pod
        marką Oddechownia Studio Jogi). Dane przetwarzane są w celu przesyłania
        informacji handlowych i marketingowych drogą elektroniczną. Podanie
        danych jest dobrowolne, a zgodę możesz wycofać w każdej chwili.
      </p>
    </Form>
  );
}
