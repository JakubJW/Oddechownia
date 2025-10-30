import { InferSelectModel } from 'drizzle-orm';
import { files } from '../db/schema';

export type FileSchema = InferSelectModel<typeof files>;
export type FileBaseDTO = Omit<FileSchema, 'createdAt' | 'updatedAt'>;
export type FileDTO = FileBaseDTO;
