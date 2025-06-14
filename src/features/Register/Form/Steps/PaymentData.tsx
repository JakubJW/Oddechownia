import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { formSchema } from '../schema';
import { z } from 'zod';

export interface PaymentDataProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export default function PaymentData({ form }: PaymentDataProps) {
  return (
    <div className="mt-6 space-y-6">
      <div className="space-y-4 p-8 rounded-xl">
        <p className="font-bold text-xl mb-4">Dane płatności</p>

        <FormField
          control={form.control}
          name="paymentData.cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numer karty</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="paymentData.expirationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data ważności</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paymentData.cvc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numer CVC</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
