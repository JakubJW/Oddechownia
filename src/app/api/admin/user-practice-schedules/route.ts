import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/infrastructure/services/user.service';
import { GetAdminSchedulesUseCase } from '@/application/use-cases/user-practice-schedule/get-admin-schedules.use-case';
import { UserPracticeScheduleRepository } from '@/infrastructure/repositories/user-practice-schedule';
import { LiveLessonsRepository } from '@/infrastructure/repositories/live-lessons.repository';
import { CreateUserPracticeScheduleUseCase } from '@/application/use-cases/user-practice-schedule/create.use-case';
import z from 'zod';

const createUserScheduleFormSchema = z.object({
  scheduledAt: z.string(),
  lessonId: z.number(),
  playlistId: z.number(),
});

export async function GET(req: NextRequest) {
  try {
    const userService = new UserService();
    const user = await userService.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const startParam = searchParams.get('start');
    const endParam = searchParams.get('end');

    if (!startParam || !endParam)
      return NextResponse.json({ error: 'Bad request' }, { status: 400 });

    const startDate = startParam;
    const endDate = endParam;

    const useCase = new GetAdminSchedulesUseCase(
      new UserPracticeScheduleRepository(),
      new LiveLessonsRepository()
    );

    const schedules = await useCase.execute(startDate, endDate);

    return NextResponse.json({});
  } catch (error) {
    console.error('Failed to fetch calendar events:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userService = new UserService();
    const user = await userService.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await req.json();
    const parsed = createUserScheduleFormSchema.safeParse(data);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation error' }, { status: 400 });
    }

    const useCase = new CreateUserPracticeScheduleUseCase(
      new UserPracticeScheduleRepository()
    );

    await useCase.execute(parsed.data);

    return NextResponse.json({});
  } catch (error) {
    console.error('Failed to fetch calendar events:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
