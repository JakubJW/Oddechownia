import { IUserPracticeScheduleRepository } from '@/application/repositories/user-practice-schedule.repository.interface';
import { UserPracticeScheduleInsert } from '@/entities/models/user-practice-schedule';

export class CreateUserPracticeScheduleUseCase {
  constructor(
    private userPracticeScheduleRepository: IUserPracticeScheduleRepository
  ) {}

  async execute(payload: UserPracticeScheduleInsert) {
    await this.userPracticeScheduleRepository.create(payload);

    return { success: true };
  }
}
