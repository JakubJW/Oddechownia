'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, defaultValues } from './schema';
import { signInToWaitlist } from '@/actions/waitlist';
import { useState } from 'react';

export default function WaitlistForm() {
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { success, error } = await signInToWaitlist(values);

    if (!success) {
      setError(error);
    }
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
                    Chcę otrzymywać informacje handlowe dotyczące produktów i
                    usług oferowanych przez Oddechownia Studio Jogi. (Wyrażam
                    zgodę na otrzymywanie od Tusz Obok (Oddechownia studio jogi)
                    informacji handlowych i marketingowych drogą elektroniczną,
                    zgodnie z ustawą o świadczeniu usług drogą elektroniczną.){' '}
                    <span className="text-red-500">*</span>
                  </Label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
        >
          Zapisz się!
        </Button>
        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
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
