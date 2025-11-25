import { NextRequest, NextResponse } from 'next/server';
import { CalendarService } from '@/server/services/calendar.service';
import { getUser } from '@/server/actions/user'; // Or however you auth
import { SchedulePlaylistSchema } from '@/server/models/practiceSchedule.models';

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    // Parse Date strings back to Date objects for Zod if needed,
    // or handle string-to-date transformation inside Zod using z.coerce.date()
    // Simplest way: let Zod coerce
    const parsed = SchedulePlaylistSchema.safeParse({
      ...body,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      lessons: body.lessons?.map((l: any) => ({
        ...l,
        scheduledAt: new Date(l.scheduledAt),
      })),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = await CalendarService.schedulePlaylist(user.id, parsed.data);

    return NextResponse.json({ success: true, count: result.count });
  } catch (error) {
    console.error('Schedule Playlist Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
