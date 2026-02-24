import { UserPracticeScheduleRepository } from '@/infrastructure/repositories/user-practice-schedule';
import { LiveLessonsRepository } from '@/infrastructure/repositories/live-lessons.repository';
// import { PurchasesRepository } from '@/infrastructure/repositories/purchases.repository';

export class GetUserSchedulesUseCase {
  constructor(
    private userPracticeScheduleRepository: UserPracticeScheduleRepository,
    private liveLessonsRepository: LiveLessonsRepository
    // private purchasesRepository: PurchasesRepository
  ) {}

  async execute(startDate: string, endDate: string) {
    const schedules = await this.userPracticeScheduleRepository.getSchedule(
      startDate,
      endDate
    );

    // const liveLessons = await this.liveLessonsRepository.getBySchedule(
    //   startDate,
    //   endDate
    // );

    return schedules;
  }
}
