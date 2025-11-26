import { NextRequest, NextResponse } from 'next/server';
import { CalendarService } from '@/server/services/calendar.service';
import { getUser } from '@/server/actions/user';
import { Params } from '@/types/types';
import z from 'zod';

export async function GET(
  req: NextRequest,
  { params }: { params: Params<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const events = await CalendarService.updateSchedule(id, user.id, true);

    return NextResponse.json(events);
  } catch (error) {
    console.error('Failed to fetch calendar events:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

const updateScheduleFormSchema = z.object({
  isCompleted: z.boolean().optional(),
  scheduledAt: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Params<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const parsed = updateScheduleFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Błąd walidacji danych' },
        { status: 400 }
      );
    }

    await CalendarService.updateSchedule(id, user.id, {
      isCompleted: parsed.data.isCompleted,
      scheduledAt: parsed.data.scheduledAt,
    });

    return NextResponse.json({ message: 'Success' }, { status: 200 });
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
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const events = await CalendarService.deleteSchedule(id, user.id);

    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch calendar events:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
