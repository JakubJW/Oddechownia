'use server';

import { createSlug } from '@/lib/utils';
import { db } from '@/server/db';
import { and, eq, inArray } from 'drizzle-orm';
import { lessonLabels, lessons } from '@/server/db/schema';
import { ActionResult } from './types';
import { BaseLesson, Lesson } from '@/server/db/types';
import {
  filterService,
  LessonFilters,
} from '@/server/services/filters.service';
import { formSchema as lessonFormSchema } from '@/features/admin/Lesson/schema';
import { createAttachment, deleteAttachment } from './attachments';
import { createFile, deleteFile } from './files';
import { BUCKETS } from '@/server/services/supabase.service';

export const createLesson = async (
  formData: FormData
): Promise<ActionResult<BaseLesson>> => {
  try {
    const rawData = {
      name: formData.get('name'),
      description: formData.get('description'),
      videoId:
        formData.get('videoId') !== 'null'
          ? Number(formData.get('videoId'))
          : null,
      labelIds: formData.getAll('labelIds[]').map((value) => Number(value)),
    };

    const parsed = lessonFormSchema.safeParse(rawData);

    if (!parsed.success) {
      return {
        data: null,
        success: false,
        error: `Błąd walidacji danych ${parsed.error.flatten()}`,
      };
    }

    const thumbnail = formData.getAll('thumbnail[]');

    if (!thumbnail.length)
      return {
        data: null,
        success: false,
        error: 'Dodanie miniatury jest obowiązkowe.',
      };

    const {
      data: thumbnailData,
      success: fileUploadSuccess,
      error: fileUplaodError,
    } = await createFile(thumbnail[0] as File, BUCKETS.ATTACHMENTS, 'lesson');

    if (!fileUploadSuccess) {
      return {
        data: null,
        success: false,
        error: fileUplaodError,
      };
    }

    const [lesson] = await db
      .insert(lessons)
      .values({
        name: parsed.data.name,
        description: parsed.data.description,
        slug: createSlug(parsed.data.name),
        videoId: parsed.data.videoId,
        thumbnailId: thumbnailData.id,
      })
      .returning();

    if (parsed.data.labelIds.length) {
      await db.insert(lessonLabels).values(
        parsed.data.labelIds.map((id) => ({
          lessonId: lesson.id,
          labelId: id,
        }))
      );
    }

    const newAttachments = formData.getAll('newAttachments[]');

    if (newAttachments.length > 0) {
      await Promise.all(
        newAttachments.map(async (file) => {
          const { error } = await createAttachment(lesson.id, file as File);

          if (error)
            throw new Error(
              `Błąd dodawania załącznika: ${(file as File).name}`
            );
        })
      );
    }

    return { data: lesson, success: true, error: null };
  } catch (e) {
    console.error(
      'Podczas tworzenia lekcji wystąpił błąd. Spróbuj ponownie później.',
      e
    );
    return {
      data: null,
      success: false,
      error:
        'Podczas tworzenia lekcji wystąpił błąd. Spróbuj ponownie później.',
    };
  }
};

export const updateLesson = async (
  id: number,
  formData: FormData
): Promise<ActionResult<BaseLesson>> => {
  try {
    const rawData = {
      name: formData.get('name'),
      description: formData.get('description'),
      videoId:
        formData.get('videoId') && formData.get('videoId') !== 'null'
          ? Number(formData.get('videoId'))
          : null,
      labelIds: formData.getAll('labelIds[]').map((value) => Number(value)),
    };

    const parsed = lessonFormSchema.safeParse({
      ...rawData,
      thumbnail: [],
      hasExistingThumbnail: true,
    });

    if (!parsed.success) {
      return { data: null, success: false, error: 'Błąd walidacji danych.' };
    }

    const thumbnailFiles = formData.getAll('thumbnail[]') as File[];
    const hasNewThumbnail =
      thumbnailFiles.length > 0 && thumbnailFiles[0].size > 0;

    const shouldRemoveOldThumbnail =
      formData.get('removeOldThumbnail') === 'true';

    if (shouldRemoveOldThumbnail && !hasNewThumbnail) {
      return {
        data: null,
        success: false,
        error: 'Nie można usunąć miniaturki bez dodania nowej.',
      };
    }

    let newThumbnailId: number | undefined = undefined;

    if (hasNewThumbnail) {
      const { data: fileData, error: uploadError } = await createFile(
        thumbnailFiles[0],
        BUCKETS.ATTACHMENTS,
        'lesson'
      );

      if (uploadError || !fileData) {
        return {
          data: null,
          success: false,
          error: 'Błąd przesyłania nowej miniaturki.',
        };
      }
      newThumbnailId = fileData.id;
    }

    let oldThumbnailIdToDelete: number | null = null;

    const updatedLesson = await db.transaction(async (tx) => {
      const currentLesson = await tx.query.lessons.findFirst({
        where: eq(lessons.id, id),
        columns: { thumbnailId: true, id: true },
        with: {
          labels: {
            with: {
              label: true,
            },
          },
        },
      });

      if (!currentLesson) throw new Error('Lekcja nie istnieje');

      const existingLabels = currentLesson.labels.map(({ labelId }) => labelId);
      const labelsToInsert = parsed.data.labelIds.filter(
        (id) => !existingLabels.includes(id)
      );
      const labelsToRemove = existingLabels.filter(
        (id) => !parsed.data.labelIds.includes(id)
      );

      console.log(labelsToInsert);
      console.log(labelsToRemove);

      if (labelsToInsert.length) {
        await db.insert(lessonLabels).values(
          labelsToInsert.map((id) => ({
            lessonId: currentLesson.id,
            labelId: id,
          }))
        );
      }

      if (labelsToRemove.length) {
        await db
          .delete(lessonLabels)
          .where(
            and(
              eq(lessonLabels.lessonId, currentLesson.id),
              inArray(lessonLabels.labelId, labelsToRemove)
            )
          );
      }

      const [updated] = await tx
        .update(lessons)
        .set({
          name: parsed.data.name,
          description: parsed.data.description,
          slug: createSlug(parsed.data.name),
          videoId: parsed.data.videoId,
          ...(newThumbnailId !== undefined && { thumbnailId: newThumbnailId }),
        })
        .where(eq(lessons.id, id))
        .returning();

      if (
        newThumbnailId &&
        currentLesson.thumbnailId &&
        newThumbnailId !== currentLesson.thumbnailId
      ) {
        oldThumbnailIdToDelete = currentLesson.thumbnailId;
      }

      const newAttachments = formData.getAll('newAttachments[]') as File[];
      if (newAttachments.length > 0) {
        await Promise.all(
          newAttachments.map(async (file) => {
            const { error } = await createAttachment(id, file);
            if (error)
              throw new Error(`Błąd dodawania załącznika: ${file.name}`);
          })
        );
      }

      const attachmentIdsToRemove = formData
        .getAll('attachmentsToRemove[]')
        .map(Number);
      if (attachmentIdsToRemove.length > 0) {
        const { error } = await deleteAttachment(attachmentIdsToRemove);
        if (error) throw new Error('Błąd usuwania załączników');
      }

      return updated;
    });

    if (oldThumbnailIdToDelete) {
      try {
        await deleteFile([oldThumbnailIdToDelete]);
      } catch (cleanupError) {
        console.error('Warning: Failed to cleanup old thumbnail', cleanupError);
      }
    }

    return { data: updatedLesson, success: true, error: null };
  } catch (e) {
    console.error('Update Lesson Error:', e);
    return {
      data: null,
      success: false,
      error: e instanceof Error ? e.message : 'Wystąpił nieoczekiwany błąd.',
    };
  }
};

export const getLessons = async (
  filters?: LessonFilters
): Promise<ActionResult<Lesson[]>> => {
  try {
    const where = filterService.buildWhereCondition(lessons, filters);
    const orderBy = filterService.buildOrderByClause(lessons, filters);

    const data = await db.query.lessons.findMany({
      where,
      orderBy,
      with: {
        video: true,
        playlistLessons: {
          with: {
            playlist: true,
          },
        },
      },
    });

    const result = data.map(({ playlistLessons, ...rest }) => {
      return {
        ...rest,
        playlists: playlistLessons.map(({ playlist }) => {
          return { ...playlist };
        }),
      };
    });

    return { data: result, success: true, error: null };
  } catch (e) {
    console.error(
      'Podczas pobierania lekcji wystąpił błąd. Spróbuj ponownie później.',
      e
    );
    return {
      data: null,
      success: false,
      error:
        'Podczas pobierania lekcji wystąpił błąd. Spróbuj ponownie później.',
    };
  }
};

export const removeLesson = async (id: number) => {
  try {
    await db.delete(lessons).where(eq(lessons.id, id));

    return { data: null, success: true, error: null };
  } catch (error) {
    console.error(
      'Podczas usuwania lekcji wystąpił błąd. Spróbuj ponownie później.',
      error
    );
    return {
      data: null,
      success: false,
      error: 'Podczas usuwania lekcji wystąpił błąd. Spróbuj ponownie później.',
    };
  }
};
