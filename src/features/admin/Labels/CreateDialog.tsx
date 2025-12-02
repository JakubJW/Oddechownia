'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createLabelFormSchema,
  createLabelFormDefaultValues,
  CreateLabelValues,
} from './createLabelFormSchema';
import { useLabels } from './hooks/useLabels';
import { Badge } from '@/components/ui/badge';
import { memo, useCallback, useEffect } from 'react';
import { hexToTailwindHSL } from '@/lib/utils';

export const getLabelStyles = (hex: string) => {
  return {
    color: `hsl(${hexToTailwindHSL(hex)})`,
    borderColor: `hsl(${hexToTailwindHSL(hex)})`,
    backgroundColor: `hsla(${hexToTailwindHSL(hex)}, 0.2)`,
  };
};

const CreateLabelDialog = ({
  label,
  open,
  onOpenChange,
}: {
  label?: any;
  open: boolean;
  onOpenChange: (state: boolean) => void;
}) => {
  const { createMutation, updateMutation } = useLabels();

  const form = useForm({
    resolver: zodResolver(createLabelFormSchema),
    defaultValues: createLabelFormDefaultValues,
    mode: 'all',
  });

  useEffect(() => {
    if (label) {
      form.reset({ ...label });
    } else {
      form.reset(createLabelFormDefaultValues);
    }
  }, [form, label]);

  const onSubmit = useCallback(
    (values: CreateLabelValues) => {
      if (label) {
        return updateMutation.mutate(
          { values, id: label.id },
          { onSuccess: () => onOpenChange(false) }
        );
      }

      return createMutation.mutate(
        { ...values },
        { onSuccess: () => onOpenChange(false) }
      );
    },
    [label, createMutation, updateMutation, onOpenChange]
  );

  const [color, text] = form.watch(['color', 'text']);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <Form {...form}>
        <form
          id="live-lesson-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Utwórz nową etykietę</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Badge
                className="font-semibold rounded-full"
                style={getLabelStyles(color)}
              >
                {text}
              </Badge>
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwa</FormLabel>
                    <FormControl>
                      <Input
                        type="string"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kolor</FormLabel>
                    <FormControl>
                      <Input
                        id="label-color"
                        type="color"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Anuluj
              </Button>
              <Button
                type="submit"
                form="live-lesson-form"
              >
                {createMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  'Zapisz'
                )}
              </Button>
            </div>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
};

export default memo(CreateLabelDialog);
