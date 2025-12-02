import { InferSelectModel } from 'drizzle-orm';
import { labels } from '../db/schema';

export type LabelSchema = InferSelectModel<typeof labels>;
export type LabelBaseSchema = LabelSchema;
