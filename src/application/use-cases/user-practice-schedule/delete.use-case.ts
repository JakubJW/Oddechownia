import { IUserPracticeScheduleRepository } from '@/application/repositories/user-practice-schedule.repository.interface';

export class DeleteUserPracticeScheduleUseCase {
  constructor(
    private userPracticeScheduleRepository: IUserPracticeScheduleRepository
  ) {}

  async execute(id: string) {
    await this.userPracticeScheduleRepository.delete(id);

    return { success: true };
  }
}
