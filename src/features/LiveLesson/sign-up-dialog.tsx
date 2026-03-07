'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PURCHASE_STATE } from '@/entities/models/purchase';
import { formatTimeForInput } from '@/lib/utils';
import { User } from '@/server/actions/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { memo } from 'react';
import { useForm } from 'react-hook-form';
import { useProductMutations } from '../products/hooks/use-product-mutations';
import {
  liveLessonSignUpFormDefaultValues,
  liveLessonSignUpFormSchema,
  LiveLessonSignUpValues,
} from './Form/schema';

type SignUpDialogProps = {
  productId: string;
  title: string;
  description?: string;
  scheduledAt: string;
  state: PURCHASE_STATE;
  open: boolean;
  price: number;
  user: User;
  setOpen: (state: boolean) => void;
};

const SignUpDialog = ({
  productId,
  title,
  description,
  scheduledAt,
  state,
  open,
  price,
  setOpen,
  user,
}: SignUpDialogProps) => {
  const { purchaseMutation, claimMutation } = useProductMutations();
  const form = useForm({
    resolver: zodResolver(liveLessonSignUpFormSchema),
    defaultValues: user
      ? { name: `${user.firstName} ${user.lastName}`, email: user.email }
      : liveLessonSignUpFormDefaultValues,
  });

  const onSubmit = async (values: LiveLessonSignUpValues) => {
    if (state === PURCHASE_STATE.CAN_CLAIM) {
      return claimMutation.mutate({ productId, values });
    }

    if (state === PURCHASE_STATE.CAN_PURCHASE) {
      return purchaseMutation.mutate({ productId, values });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <Form {...form}>
        <form
          id="live-lesson-sign-up-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="leading-normal">
                <span className="block text-sm font-normal text-muted-foreground mb-4">
                  {new Date(scheduledAt).toLocaleDateString('pl-PL')},{' '}
                  {formatTimeForInput(scheduledAt)}
                </span>
                {title}
              </DialogTitle>
              <DialogDescription>{description || ''}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imię i nazwisko*</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={user !== null}
                        placeholder="Jan Kowalski"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail*</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="jan@example.com"
                          disabled={user !== null}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {user?.email && (
                  <p className="text-sm text-muted-foreground">
                    Używamy danych z Twojego konta.
                  </p>
                )}
              </div>
              {/* {state === PURCHASE_STATE.CAN_CLAIM && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-sm">
                  <p className="font-medium text-primary">
                    {freeEligibilitiesUsed! < 2
                      ? `✨ Darmowe zajęcia (${freeEligibilitiesUsed} z 2)`
                      : `Wykorzystano darmowe zajęcia`}
                  </p>
                </div>
              )} */}
              <Button
                className="w-full"
                form="live-lesson-sign-up-form"
                type="submit"
                disabled={claimMutation.isPending || purchaseMutation.isPending}
              >
                {(claimMutation.isPending || purchaseMutation.isPending) && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                {state === PURCHASE_STATE.CAN_CLAIM
                  ? 'Zapisz się za darmo'
                  : `Przejdź do płatności (${new Intl.NumberFormat('pl-PL', {
                      style: 'currency',
                      currency: 'PLN',
                    }).format(price / 100)})`}
              </Button>
              {state === PURCHASE_STATE.CAN_PURCHASE && (
                <p className="text-xs text-muted-foreground text-center">
                  Zostaniesz przekierowany do bezpiecznej płatności Stripe
                </p>
              )}
            </div>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
};

export default memo(SignUpDialog);
