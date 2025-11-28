import { NextRequest, NextResponse } from 'next/server';
import { CalendarService } from '@/server/services/calendar.service';
import { getUser } from '@/server/actions/user';

export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const startParam = searchParams.get('start');
    const endParam = searchParams.get('end');

    const startDate = startParam ? startParam : undefined;
    const endDate = endParam ? endParam : undefined;

    const events = await CalendarService.getUserSchedule(
      user.id,
      startDate,
      endDate
    );

    return NextResponse.json(events);
  } catch (error) {
    console.error('Failed to fetch calendar events:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
