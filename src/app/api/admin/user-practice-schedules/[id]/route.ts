import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/infrastructure/services/user.service';
import { UserPracticeScheduleRepository } from '@/infrastructure/repositories/user-practice-schedule';
import z from 'zod';
import { UpdateUserPracticeScheduleUseCase } from '@/application/use-cases/user-practice-schedule/update.use-case';
import { DeleteUserPracticeScheduleUseCase } from '@/application/use-cases/user-practice-schedule/delete.use-case';
import { Params } from '@/types/types';

const createUserScheduleFormSchema = z.object({
  scheduledAt: z.string(),
  lessonId: z.number(),
  playlistId: z.number(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Params<{ id: string }> }
) {
  try {
    const userService = new UserService();
    const user = await userService.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = createUserScheduleFormSchema.safeParse(body);

    if (!id || !parsed.success)
      return NextResponse.json({ error: 'Bad request' }, { status: 400 });

    const useCase = new UpdateUserPracticeScheduleUseCase(
      new UserPracticeScheduleRepository()
    );

    await useCase.execute(id, parsed.data);

    return NextResponse.json({});
  } catch (error) {
    console.error('Failed to fetch calendar events:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Params<{ id: string }> }
) {
  try {
    const userService = new UserService();
    const user = await userService.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    const useCase = new DeleteUserPracticeScheduleUseCase(
      new UserPracticeScheduleRepository()
    );

    await useCase.execute(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to fetch calendar events:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
