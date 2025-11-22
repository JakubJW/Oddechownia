'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatTimeForInput } from '@/lib/utils';
import { LiveLessonCardDTO } from '@/server/models/liveLesson.models';
import { useMutation } from '@tanstack/react-query';
import { Calendar, Clock } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { LiveLessonSignUpValues } from './Form/schema';
import SignUpDialog from './SignUpDialog';
import { LiveLessonSignUpResponse } from '@/server/models/liveLesson.models';
import { User } from '@/server/actions/user';

type GridProps = {
  lessons: LiveLessonCardDTO[];
  user: User;
};

const signUp = async ({
  id,
  values,
}: {
  id: string;
  values: LiveLessonSignUpValues;
}) => {
  const res = await fetch(`/api/live-lessons/${id}/sign-up`, {
    method: 'POST',
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    const errorBody = (await res.json()) as { message: string };

    throw new Error(errorBody.message || 'Unknown error');
  }

  const json = await res.json();
  return json.data as LiveLessonSignUpResponse;
};

const getButtonContent = (
  isListed: boolean,
  isRegistered: boolean,
  isPaymentPending: boolean
) => {
  if (!isListed && !isRegistered) return 'Zarezerwuj miejsce';
  if (isRegistered && isPaymentPending) return 'Dokończ płatność';
  if (isRegistered && !isPaymentPending) return 'Już zapisany';
  return 'Zapisy zamknięte';
};

export const Grid = ({ lessons, user }: GridProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<
    LiveLessonCardDTO | undefined
  >(undefined);

  const mutation = useMutation<
    LiveLessonSignUpResponse,
    Error,
    { id: string; values: LiveLessonSignUpValues }
  >({
    mutationFn: signUp,
    onSuccess: (data) => {
      setDialogOpen(false);
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-10">
      {lessons.map((lesson) => (
        <Card key={lesson.id}>
          <CardHeader>
            <CardTitle>{lesson.title}</CardTitle>
            <div className="flex gap-1">
              {lesson.isRegistered && <Badge>Zapisano</Badge>}
              {lesson.isPaymentPending && (
                <Badge variant="outline">Płatność oczekująca</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  {new Date(lesson.scheduledAt).toLocaleDateString('pl-PL', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  {`${formatTimeForInput(lesson.scheduledAt)} (${
                    lesson.duration
                  } min)`}
                </span>
              </div>
            </div>
            <Button
              className="w-full"
              disabled={
                lesson.isListed ||
                (lesson.isRegistered && !lesson.isPaymentPending)
              }
              onClick={() => {
                setCurrentLesson(lesson);
                setDialogOpen(true);
              }}
            >
              {getButtonContent(
                lesson.isListed,
                lesson.isRegistered,
                lesson.isPaymentPending
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
      {currentLesson && (
        <SignUpDialog
          mutation={mutation}
          user={user}
          liveLesson={currentLesson}
          open={dialogOpen}
          setOpen={setDialogOpen}
        />
      )}
    </div>
  );
};
