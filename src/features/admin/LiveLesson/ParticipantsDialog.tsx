'use client';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { FetchAdminLiveLessonsParticipantsListResponse } from '@/server/models/liveLesson.models';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import React from 'react';

const getStatusBadge = (status?: string) => {
  switch (status) {
    case 'paid':
      return <Badge className="bg-green-600">Opłacone</Badge>;
    case 'unpaid':
      return <Badge variant="secondary">Oczekuje</Badge>;
    default:
      return <Badge className="bg-green-500">Za darmo</Badge>;
  }
};

// const exportToCSV = () => {
//   const headers = [
//     'Imię i nazwisko',
//     'Email',
//     'Status płatności',
//     'Kwota (PLN)',
//     'Data rejestracji',
//   ];
//   const rows = registrations.map((reg) => [
//     reg.name,
//     reg.email,
//     reg.payment_status === 'paid' ? 'Opłacone' : 'Oczekuje',
//     reg.payment_status === 'completed' && reg.amount_paid > 0
//       ? (reg.amount_paid / 100).toFixed(2)
//       : '0.00',
//     new Date(reg.created_at).toLocaleString('pl-PL'),
//   ]);

//   const csvContent = [
//     headers.join(','),
//     ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
//   ].join('\n');

//   const blob = new Blob(['\ufeff' + csvContent], {
//     type: 'text/csv;charset=utf-8;',
//   });
//   const link = document.createElement('a');
//   const url = URL.createObjectURL(blob);
//   link.setAttribute('href', url);
//   link.setAttribute(
//     'download',
//     `zapisy_zajecia_${lessonId}_${new Date().toISOString().split('T')[0]}.csv`
//   );
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);

//   toast('Sukces', {
//     description: 'Lista zapisów została wyeksportowana.',
//   });
// };

const fetchRegistrations = async (id: string) => {
  const res = await fetch(`/api/live-lessons/${id}/registrations`, {
    method: 'GET',
  });

  if (!res.ok) {
    const errorBody = await res
      .json()
      .catch(() => ({ message: res.statusText }));

    throw new Error(errorBody.message || 'Unknown error');
  }

  const json = await res.json();
  return json as FetchAdminLiveLessonsParticipantsListResponse;
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
          {/* <Button
            onClick={exportToCSV}
            size="sm"
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            Eksportuj CSV
          </Button> */}
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

  if (data.data.length === 0) {
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
        {data.data.map((reg) => (
          <div
            key={reg.id}
            className="p-4 border rounded-lg space-y-2"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{reg.name}</p>
                <p className="text-sm text-muted-foreground">{reg.email}</p>
              </div>
              {getStatusBadge(reg.paymentStatus)}
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Zarejestrowano: &nbsp;
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
          <span className="font-semibold">{data.data.length}</span>
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
