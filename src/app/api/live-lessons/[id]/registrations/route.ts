import { NextRequest, NextResponse } from 'next/server';
import { LiveLessonsRegistrationsService } from '@/server/services/liveLessonsRegistrations.service';
// import { logger } from '@/server/lib/logger.service';
import { AppError } from '@/server/lib/errors';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // const log = logger.child({ module: 'live-lessons' });

  try {
    const { id } = await params;

    const result =
      await LiveLessonsRegistrationsService.getLessonRegistrations(id);

    return NextResponse.json(
      { message: 'Success!', data: result },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { message: error.userMessage },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
