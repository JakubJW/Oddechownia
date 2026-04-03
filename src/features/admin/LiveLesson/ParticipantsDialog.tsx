'use client';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ACQUISITION_METHOD } from '@/entities/models/purchase';
import { LiveLessonRegistrationCardDTO } from '@/server/models/liveLessonRegistration.models';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import React from 'react';

const getStatusBadge = (acquiredBy?: ACQUISITION_METHOD) => {
  switch (acquiredBy) {
    case ACQUISITION_METHOD.PAYMENT:
      return <Badge className="bg-green-600">Opłacone</Badge>;
    case ACQUISITION_METHOD.FREE_PUBLIC:
      return <Badge variant="secondary">Za darmo</Badge>;
    case ACQUISITION_METHOD.SUBSCRIPTION_QUOTA:
      return <Badge variant="secondary">Za kredyty</Badge>;
    default:
      return <Badge className="bg-green-500">Za darmo</Badge>;
  }
};

const fetchRegistrations = async (id: string) => {
  const res = await fetch(`/api/admin/live-lessons/${id}/registrations`, {
    method: 'GET',
  });

  if (!res.ok) {
    const errorBody = await res
      .json()
      .catch(() => ({ message: res.statusText }));

    throw new Error(errorBody.message || 'Unknown error');
  }

  const json = await res.json();
  return json as LiveLessonRegistrationCardDTO[];
};

const BaseDialog = ({
  children,
  open,
  setOpen,
}: {
  children: React.ReactNode;
  open: boolean;
  setOpen: (state: boolean) => void;
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Zapisy na zajęcia</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

const ParticipantsDialog = ({
  lessonId,
  open,
  setOpen,
}: {
  lessonId: string;
  open: boolean;
  setOpen: (state: boolean) => void;
}) => {
  const { data, isError, isPending, error } = useQuery({
    queryKey: ['live-lesson-registrations', lessonId],
    queryFn: () => fetchRegistrations(lessonId),
  });

  if (isPending) {
    return (
      <BaseDialog
        open={open}
        setOpen={setOpen}
      >
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </BaseDialog>
    );
  }

  if (isError) {
    return (
      <BaseDialog
        open={open}
        setOpen={setOpen}
      >
        {error.message}
      </BaseDialog>
    );
  }

  if (data.length === 0) {
    return (
      <BaseDialog
        open={open}
        setOpen={setOpen}
      >
        <div className="text-center py-8 text-muted-foreground">
          Brak zapisów na te zajęcia
        </div>
      </BaseDialog>
    );
  }

  return (
    <BaseDialog
      open={open}
      setOpen={setOpen}
    >
      <div className="grid gap-3">
        {data.map((reg) => (
          <div
            key={reg.id}
            className="p-4 border rounded-lg space-y-2"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{reg.name}</p>
                <p className="text-sm text-muted-foreground">{reg.email}</p>
              </div>
              {getStatusBadge(reg.acquisitionMethod)}
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Zapisano: &nbsp;
                {new Date(reg.createdAt).toLocaleDateString('pl-PL', {
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              {/* {reg.paymentStatus === 'completed' && reg.amount_paid > 0 && (
                  <span className="font-medium text-green-600">
                    {(reg.amount_paid / 100).toFixed(2)} PLN
                  </span>
                )} */}
            </div>
          </div>
        ))}
      </div>
      <div className="pt-4 border-t">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Łączna liczba zapisów:</span>
          <span className="font-semibold">{data.length}</span>
        </div>
        {/* <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Opłacone:</span>
          <span className="font-semibold text-green-600">
            {data.data.filter((r) => r.paymentStatus === 'paid').length}
          </span>
        </div> */}
        {/* <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Łączny przychód:</span>
          <span className="font-semibold text-primary">
            {(
                data
                  .filter((r) => r.paymentStatus === 'completed')
                  .reduce((sum, r) => sum + (r.amount_paid || 0), 0) / 100
              ).toFixed(2)}{' '}
              PLN
          </span>
        </div> */}
      </div>
    </BaseDialog>
  );
};

export default ParticipantsDialog;
