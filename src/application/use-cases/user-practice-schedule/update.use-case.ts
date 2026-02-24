import { IUserPracticeScheduleRepository } from '@/application/repositories/user-practice-schedule.repository.interface';
import { UserPracticeScheduleInsert } from '@/entities/models/user-practice-schedule';

export class UpdateUserPracticeScheduleUseCase {
  constructor(
    private userPracticeScheduleRepository: IUserPracticeScheduleRepository
  ) {}

  async execute(scheduleId: string, payload: UserPracticeScheduleInsert) {
    await this.userPracticeScheduleRepository.update(scheduleId, payload);

    return { success: true };
  }
}
