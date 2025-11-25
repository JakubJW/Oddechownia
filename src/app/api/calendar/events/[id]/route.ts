import { NextRequest, NextResponse } from 'next/server';
import { CalendarService } from '@/server/services/calendar.service';
import { getUser } from '@/server/actions/user';
import { Params } from '@/types/types';

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
