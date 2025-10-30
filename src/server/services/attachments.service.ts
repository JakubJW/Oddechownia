import {
  AttachmentSchema,
  AttachmentDTO,
  AdminEditLessonAttachmentDTO,
} from '../models/attachment.models';
import { eq, inArray } from 'drizzle-orm';
import { attachments, files } from '../db/schema';
import { db } from '../db';
import { supabaseService } from './supabase.service';

const transformAttachmentsToDTO = (
  attachments: AttachmentSchema[]
): AttachmentDTO[] => {
  return attachments.map((attachment) => ({
    id: attachment.id,
    name: attachment.file.name,
    originalName: attachment.file.originalName,
  }));
};

const transformToAdminEditLessonAttachmentDTO = (
  attachments: AttachmentSchema[]
): AdminEditLessonAttachmentDTO[] => {
  return attachments.map((attachment) => ({
    id: attachment.id,
    name: attachment.file.name,
    originalName: attachment.file.originalName,
    url: supabaseService.getFileUrl(
      attachment.file.name,
      attachment.file.bucket,
      attachment.file.path
    ).data,
  }));
};

const getAttachmentsByName = async (name: string) => {
  const attachmentIds = db
    .select({ id: attachments.id })
    .from(attachments)
    .innerJoin(files, eq(attachments.fileId, files.id))
    .where(eq(files.name, name));

  const result = await db.query.attachments.findMany({
    where: inArray(attachments.id, attachmentIds),
    with: {
      file: true,
    },
  });

  return transformAttachmentsToDTO(result);
};

export const AttachmentsService = {
  transformAttachmentsToDTO,
  transformToAdminEditLessonAttachmentDTO,
  getAttachmentsByName,
};
