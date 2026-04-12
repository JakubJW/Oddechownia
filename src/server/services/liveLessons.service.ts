import { updateFormSchema } from '@/features/admin/LiveLesson/Form/schema';
import { and, eq } from 'drizzle-orm';
import { CreateBatchOptions } from 'resend';
import { z } from 'zod';
import { db } from '../db';
import { liveLessons, liveLessonsRegistrations } from '../db/schema';
import { NotFoundError } from '../lib/errors';
import { logger } from '../lib/logger.service';
import { EmailService, templates } from './emails.service';

function normalizeInput<T extends Record<string, unknown>>(input: T): T {
  const normalized = { ...input };
  for (const key in normalized) {
    if (normalized[key] === undefined) {
      (normalized as Record<string, unknown>)[key] = null;
    }
  }
  return normalized;
}

const log = logger.child({ module: 'live-lessons' });

const update = async (id: string, values: z.infer<typeof updateFormSchema>) => {
  const currentLesson = await db.query.liveLessons.findFirst({
    columns: { recordingUrl: true },
    where: eq(liveLessons.id, id),
  });

  if (!currentLesson) {
    throw new NotFoundError('Live lesson');
  }

  const cleanValues = normalizeInput(values);

  const [updatedLesson] = await db
    .update(liveLessons)
    .set({ ...values })
    .where(eq(liveLessons.id, id))
    .returning();

  const recordingChanged =
    cleanValues.recordingUrl !== currentLesson.recordingUrl;

  const shouldNotify =
    recordingChanged && typeof updatedLesson.recordingUrl === 'string';

  if (shouldNotify) {
    await notifyRegistrantsAboutRecording(
      updatedLesson.id,
      updatedLesson.title,
      updatedLesson.recordingUrl!
    );
  }

  return updatedLesson;
};

const notifyRegistrantsAboutRecording = async (
  lessonId: string,
  lessonTitle: string,
  recordingUrl: string
) => {
  const registrations = await db.query.liveLessonsRegistrations.findMany({
    columns: { name: true, email: true },
    where: and(
      eq(liveLessonsRegistrations.lessonId, lessonId),
      eq(liveLessonsRegistrations.paymentStatus, 'paid'),
      eq(liveLessonsRegistrations.accessMethod, 'paid_one_time')
    ),
  });

  if (!registrations.length) return;

  const recipientsData: CreateBatchOptions = registrations.map((r) => ({
    to: r.email,
    template: {
      id: templates.liveLesson.recordingAvailable,
      variables: {
        RECIPIENT_NAME: r.name,
        LIVE_LESSON_TITLE: lessonTitle,
        LIVE_LESSON_RECORDING_URL: recordingUrl,
      },
    },
  }));

  const { error } = await EmailService.sendBatch(recipientsData);
  if (error) {
    log.error({ message: 'Failed to send recording notifications', error });
  }
};

export const LiveLessonsService = {
  update,
};
