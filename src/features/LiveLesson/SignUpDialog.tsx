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
import { formatTimeForInput } from '@/lib/utils';
import { LiveLessonCardDTO } from '@/server/models/liveLesson.models';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { memo } from 'react';
import { useForm } from 'react-hook-form';
import {
  type LiveLessonSignUpValues,
  liveLessonSignUpFormDefaultValues,
  liveLessonSignUpFormSchema,
} from './Form/schema';
import { User } from '@/server/actions/user';
import { useLiveLessonMutations } from './hooks/useLiveLessonMutations';

type SignUpDialogProps = {
  user: User;
  liveLesson: Pick<
    LiveLessonCardDTO,
    | 'id'
    | 'title'
    | 'description'
    | 'scheduledAt'
    | 'isEligibleForFree'
    | 'freeEligibilitiesUsed'
  >;
  open: boolean;
  setOpen: (state: boolean) => void;
};

const SignUpDialog = ({
  liveLesson,
  open,
  setOpen,
  user,
}: SignUpDialogProps) => {
  const { signUpMutation } = useLiveLessonMutations();
  const form = useForm({
    resolver: zodResolver(liveLessonSignUpFormSchema),
    defaultValues: user
      ? { name: `${user.firstName} ${user.lastName}`, email: user.email }
      : liveLessonSignUpFormDefaultValues,
  });

  const onSubmit = async (values: LiveLessonSignUpValues) => {
    if (!liveLesson) return;
    signUpMutation.mutate(
      { id: liveLesson.id, values },
      { onSuccess: () => setOpen(false) }
    );
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
              <DialogTitle>Zapisz się na zajęcia</DialogTitle>
              <DialogDescription>
                {liveLesson.title} - &nbsp;
                {new Date(liveLesson.scheduledAt).toLocaleDateString('pl-PL')} o
                &nbsp;
                {formatTimeForInput(liveLesson.scheduledAt)}
              </DialogDescription>
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
              {liveLesson.isEligibleForFree && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-sm">
                  <p className="font-medium text-primary">
                    {liveLesson.freeEligibilitiesUsed! < 2
                      ? `✨ Darmowe zajęcia (${liveLesson.freeEligibilitiesUsed} z 2)`
                      : `Wykorzystano darmowe zajęcia`}
                  </p>
                </div>
              )}
              <Button
                className="w-full"
                form="live-lesson-sign-up-form"
                type="submit"
                disabled={signUpMutation.isPending}
              >
                {signUpMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {liveLesson.isEligibleForFree
                  ? 'Zapisz się za darmo'
                  : 'Przejdź do płatności (29 PLN)'}
              </Button>
              {!liveLesson.isEligibleForFree && (
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
