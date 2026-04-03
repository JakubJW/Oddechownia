import { ACQUISITION_METHOD } from '@/entities/models/purchase';

export type LiveLessonRegistrationCardDTO = {
  id: string;
  name: string;
  email: string;
  acquisitionMethod: ACQUISITION_METHOD;
  createdAt: string;
};
