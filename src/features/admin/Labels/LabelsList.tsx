'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import { useState } from 'react';
import CreateLabelDialog from './CreateDialog';
import { useLabels } from './hooks/useLabels';
import { LessonLabel } from '@/components/LessonLabel';

export const LabelsList = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [label, setLabel] = useState<
    { id: number; text: string; color: string } | undefined
  >(undefined);
  const { deleteMutation, queryLabels } = useLabels();

  if (queryLabels.isPending) return <div>Ładowanie</div>;

  if (queryLabels.isError) return <div>Błąd {queryLabels.error.message}</div>;

  return (
    <div className="flex flex-col max-w-lg">
      <Button
        className="w-min mb-4 self-end"
        onClick={() => {
          setLabel(undefined);
          setDialogOpen(true);
        }}
      >
        Dodaj etykietę
      </Button>
      {queryLabels.data.data.map((label) => (
        <div
          key={label.id}
          className="flex justify-between items-center border-b pb-4 last:border-b-0 mb-4"
        >
          <LessonLabel label={{ text: label.text, color: label.color }} />
          <div className="space-x-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => {
                setLabel(label);
                setDialogOpen(true);
              }}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => deleteMutation.mutate(label.id)}
            >
              <Trash className="size-4" />
            </Button>
          </div>
        </div>
      ))}
      <CreateLabelDialog
        label={label}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};
