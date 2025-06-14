import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { formSchema } from '../schema';
import { z } from 'zod';
import { memo } from 'react';

export interface AccountDataProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

const AccountData = ({ form }: AccountDataProps) => {
  return (
    <div className="mt-6 space-y-6">
      <div className="space-y-4 p-8 rounded-xl">
        <p className="font-bold text-xl mb-4">Twoje dane</p>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="accountData.firstName"
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
            name="accountData.lastName"
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
          name="accountData.email"
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
            name="accountData.password"
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
            name="accountData.passwordConfirmation"
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
          name="accountData.regulationsAgreement"
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
          name="accountData.privacyPolicyAgreement"
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
                    Oświadczam, że zapoznałem się z Polityką Prywatności w tym z
                    informacją o dobrowolnym charakterze wyrażenia zgody oraz
                    prawie do wycofania zgody w każdym czasie.{' '}
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
  );
};

export default memo(AccountData);
