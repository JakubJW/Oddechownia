import { NextRequest, NextResponse } from 'next/server';
import { ProgressService } from '@/server/services/progress.service';
import { createClient } from '@/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { lessonId, seconds, totalDuration, playlistId } = body;

    if (!lessonId || typeof seconds !== 'number') {
      return NextResponse.json({ error: 'Invalid Data' }, { status: 400 });
    }

    const progressRatio = totalDuration > 0 ? seconds / totalDuration : 0;
    const isCompletedNow = progressRatio >= 0.9;

    await ProgressService.saveProgress(
      lessonId,
      seconds,
      totalDuration,
      session.user.id,
      playlistId
    );

    return NextResponse.json({ success: true, isCompleted: isCompletedNow });
  } catch (error) {
    console.error('[API] Save Progress Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
