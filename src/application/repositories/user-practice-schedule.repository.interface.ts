import {
  UserPracticeSchedule,
  UserPracticeScheduleEvent,
  UserPracticeScheduleInsert,
} from '@/entities/models/user-practice-schedule';

export interface IUserPracticeScheduleRepository {
  create(payload: UserPracticeScheduleInsert): Promise<UserPracticeSchedule>;
  update(
    scheduleId: string,
    payload: Partial<UserPracticeScheduleInsert>
  ): Promise<UserPracticeSchedule>;
  delete(scheduleId: string): Promise<void>;
  // getByUserId(
  //   userId: string,
  //   startDate?: string,
  //   endDate?: string
  // ): Promise<UserPracticeScheduleEvent[]>;
  getSchedule(
    startDate?: string,
    endDate?: string
  ): Promise<UserPracticeScheduleEvent[]>;
}
