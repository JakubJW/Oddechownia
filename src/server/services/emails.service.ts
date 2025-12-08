import {
  Resend,
  CreateEmailOptions,
  CreateEmailRequestOptions,
  CreateBatchOptions,
} from 'resend';
import { env } from '@/env';

export const templates = {
  liveLesson: {
    confirmRegistration: '0daf4eee-3e52-4982-b49f-e98e72af0513',
    reminder: '2f0b022f-aa36-4c88-9b66-4f7210870195',
    aboutToStart: '',
    recordingAvailable: '5f2ba5a0-58d2-4868-9c22-b06831bdfee1',
  },
  auth: {
    confirmRegistration: 'edc50f4a-af2c-4ea2-ac02-e8b335ffd015',
  },
} as const;

const send = async (
  payload: CreateEmailOptions,
  options?: CreateEmailRequestOptions
) => {
  const resend = new Resend(env.NEXT_RESEND_API_KEY);

  const { data, error } = await resend.emails.send(payload, options);

  return { data, error };
};

const sendBatch = async (
  payload: CreateBatchOptions,
  options?: CreateEmailRequestOptions
) => {
  const resend = new Resend(env.NEXT_RESEND_API_KEY);

  const { data, error } = await resend.batch.send(payload, options);

  return { data, error };
};

const sendLiveLessonRegistrationConfirmaion = async (
  recipientEmail: string,
  recipientName: string,
  lessonName: string,
  lessonScheduledAt: string
) => {
  const { data, error } = await send({
    to: [recipientEmail],
    template: {
      id: templates.liveLesson.confirmRegistration,
      variables: {
        RECIPIENT_NAME: recipientName,
        LIVE_LESSON_NAME: lessonName,
        LIVE_LESSON_SCHEDULED_AT: new Intl.DateTimeFormat('pl-PL', {
          timeZone: 'Europe/Warsaw',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(lessonScheduledAt)),
      },
    },
  });
};

const scheduleLiveLessonRemind = async (
  recipientEmail: string,
  recipientName: string,
  lessonName: string,
  lessonScheduledAt: string
) => {
  const lessonDate = new Date(lessonScheduledAt);
  const scheduledSendDateObject = new Date(
    lessonDate.getTime() - 15 * 60 * 1000
  );
  const scheduledSendDateISO = scheduledSendDateObject.toISOString();

  const { data, error } = await send({
    to: [recipientEmail],
    scheduledAt: scheduledSendDateISO,
    template: {
      id: templates.liveLesson.reminder,
      variables: {
        RECIPIENT_NAME: recipientName,
        LIVE_LESSON_NAME: lessonName,
        LIVE_LESSON_SCHEDULED_AT: new Intl.DateTimeFormat('pl-PL', {
          timeZone: 'Europe/Warsaw',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(lessonScheduledAt)),
      },
    },
  });
};

export const sendLiveLessonRecordingMail = async (
  recipientEmail: string,
  recipientName: string,
  lessonName: string,
  recordingUrl: string
) => {
  const { data, error } = await send({
    to: [recipientEmail],
    template: {
      id: templates.liveLesson.recordingAvailable,
      variables: {
        RECIPIENT_NAME: recipientName,
        LIVE_LESSON_NAME: lessonName,
        LIVE_LESSON_RECORDING_URL: recordingUrl,
      },
    },
  });
};

export const sendRegistrationConfirmation = async (
  recipientEmail: string,
  recipientName: string
) => {
  const { data, error } = await send({
    to: [recipientEmail],
    template: {
      id: templates.auth.confirmRegistration,
      variables: {
        RECIPIENT_NAME: recipientName,
      },
    },
  });

  if (error) {
    console.error('Failed to send confirmation email:', error);
  }
};

export const EmailService = {
  send,
  sendBatch,
  sendLiveLessonRegistrationConfirmaion,
  scheduleLiveLessonRemind,
  sendLiveLessonRecordingMail,
  sendRegistrationConfirmation,
};
