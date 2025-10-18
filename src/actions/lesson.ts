'use server';

import { createSlug } from '@/lib/utils';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { lessons } from '@/db/schema';
import { ActionResult } from './types';
import { BaseLesson, Lesson } from '@/db/types';
import { filterService, LessonFilters } from '@/services/filters';
import { formSchema as lessonFormSchema } from '@/features/admin/Lesson/schema';
import { createAttachment, deleteAttachment } from './attachments';
import { createFile } from './files';
import { BUCKETS, supabaseService } from '@/services/supabase';

export const createLesson = async (
  formData: FormData
): Promise<ActionResult<BaseLesson>> => {
  try {
    const rawData = {
      name: formData.get('name'),
      description: formData.get('description'),
      videoId: Number(formData.get('videoId')),
    };

    const parsed = lessonFormSchema.safeParse(rawData);

    if (!parsed.success) {
      return {
        data: null,
        success: false,
        error: 'Podczas edytownaia lekcji wystąpił błąd.',
      };
    }

    const thumbnail = formData.getAll('thumbnail[]');

    if (!thumbnail) return { data: null, success: false, error: 'Błąd' };

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

    const newAttachments = formData.getAll('newAttachments[]');
    const attachmentsToRemove = formData.getAll('attachmentsToRemove[]');

    if (newAttachments) {
      for (let i = 0; i < newAttachments.length; i++) {
        const {
          success: createAttachmentSuccess,
          error: createAttachmentError,
        } = await createAttachment(lesson.id, newAttachments[i] as File);

        if (!createAttachmentSuccess) {
          return { data: null, success: false, error: createAttachmentError };
        }
      }
    }

    if (attachmentsToRemove && attachmentsToRemove.length) {
      const { error } = await deleteAttachment(
        attachmentsToRemove.map((value) => Number(value))
      );

      if (error) {
        throw new Error(error);
      }
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
        formData.get('videoId') === 'null'
          ? null
          : Number(formData.get('videoId')),
    };
    const parsed = lessonFormSchema.safeParse(rawData);

    if (!parsed.success) {
      return {
        data: null,
        success: false,
        error: 'Podczas edytownaia lekcji wystąpił błąd.',
      };
    }

    const thumbnail = formData.getAll('thumbnail[]');
    const removeOldThumbnail = formData.get('removeOldThumbnail')
      ? Boolean(formData.get('removeOldThumbnail'))
      : false;
    let newThumbnailId: number | undefined = undefined;

    if (removeOldThumbnail && thumbnail) {
      const [lesson] = await db.query.lessons.findMany({
        columns: {},
        with: {
          thumbnail: true,
        },
      });

      const {
        thumbnail: { bucket, path, name },
      } = lesson;

      await supabaseService.deleteFile(bucket, [`${path}/${name}`]);

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

      newThumbnailId = thumbnailData.id;
    }

    const [lesson] = await db
      .update(lessons)
      .set({
        name: parsed.data.name,
        description: parsed.data.description,
        slug: createSlug(parsed.data.name),
        thumbnailId: newThumbnailId,
      })
      .where(eq(lessons.id, id))
      .returning();

    const newAttachments = formData.getAll('newAttachments[]');
    const attachmentsToRemove = formData.getAll('attachmentsToRemove[]');

    if (newAttachments) {
      for (let i = 0; i < newAttachments.length; i++) {
        const { error } = await createAttachment(id, newAttachments[i] as File);

        if (error) {
          throw new Error(error);
        }
      }
    }

    if (attachmentsToRemove && attachmentsToRemove.length) {
      const { error } = await deleteAttachment(
        attachmentsToRemove.map((value) => Number(value))
      );

      if (error) {
        throw new Error(error);
      }
    }

    return { data: lesson, success: true, error: null };
  } catch (e) {
    if (e instanceof Error) {
      console.error('Unable to update lesson', e.message);
      return { data: null, success: false, error: e.message };
    }

    return { data: null, success: false, error: 'Unable to update lesson' };
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

export const getLesson = async (
  filters: LessonFilters
): Promise<ActionResult<Lesson>> => {
  try {
    const lessonWhereClause = filterService.buildWhereCondition(
      lessons,
      filters
    );

    const [lesson] = await db.query.lessons.findMany({
      ...(lessonWhereClause && { where: lessonWhereClause }),
      with: {
        video: true,
        attachments: {
          with: {
            file: true,
          },
        },
        thumbnail: true,
      },
    });

    const {
      thumbnail: { bucket, path, name },
    } = lesson;
    const { data: fileUrl, error: fileUrlError } = supabaseService.getFileUrl(
      name,
      bucket,
      path
    );

    const domainLesson = {
      ...lesson,
      attachments: lesson.attachments.map(({ file, ...rest }) => ({
        url: supabaseService.getFileUrl(file.name, file.bucket, file.path).data,
        file,
        ...rest,
      })),
    };

    return {
      data: { ...domainLesson, thumbnailUrl: fileUrl },
      success: true,
      error: null,
    };
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
