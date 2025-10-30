import { attachments } from '../db/schema';
import { InferSelectModel } from 'drizzle-orm';
import { FileDTO } from './file.models';
import { FileSchema } from './file.models';

export type AttachmentSchema = InferSelectModel<typeof attachments> & {
  file: FileSchema;
};
export type AttachmentBaseDTO = FileDTO;
export type AttachmentDTO = Pick<AttachmentBaseDTO, 'id' | 'name'> & {
  originalName: string;
};

export type AdminEditLessonAttachmentDTO = AttachmentDTO & {
  url: string;
};
