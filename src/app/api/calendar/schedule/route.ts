import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { CalendarService } from '@/server/services/calendar.service';
import { getUser } from '@/server/actions/user';

const ScheduleApiSchema = z.object({
  lessonId: z.number(),
  playlistId: z.number().optional(),
  scheduledAt: z.string().datetime(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = ScheduleApiSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { lessonId, playlistId, scheduledAt } = parsed.data;

    await CalendarService.createSchedule(
      user.id,
      lessonId,
      playlistId,
      new Date(scheduledAt)
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Schedule API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
