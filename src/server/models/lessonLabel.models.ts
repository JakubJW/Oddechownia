import { InferSelectModel } from 'drizzle-orm';
import { lessonLabels } from '../db/schema';
import { LabelBaseSchema } from './label.models';

export type LessonLabelsSchema = InferSelectModel<typeof lessonLabels>;
export type LessonLabelBaseSchema = LessonLabelsSchema & {
  label: LabelBaseSchema;
};

export type LabelDTO = {
  id: number;
  text: string;
  color: string;
};
