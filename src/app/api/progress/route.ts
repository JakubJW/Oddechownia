import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/server/actions/user'; // Or your session helper
import { ProgressService } from '@/server/services/progress.service';

export async function POST(req: NextRequest) {
  try {
    // 1. Auth Check
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse Body
    const body = await req.json();
    const { lessonId, seconds, totalDuration, playlistId } = body;

    if (!lessonId || typeof seconds !== 'number') {
      return NextResponse.json({ error: 'Invalid Data' }, { status: 400 });
    }

    // 3. Logic (90% Threshold)
    const progressRatio = totalDuration > 0 ? seconds / totalDuration : 0;
    const isCompletedNow = progressRatio >= 0.9;

    // 4. Database Upsert
    await ProgressService.saveProgress(
      lessonId,
      seconds,
      totalDuration,
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
