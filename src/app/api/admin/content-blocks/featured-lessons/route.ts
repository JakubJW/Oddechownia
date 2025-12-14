import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/server/actions/user';
import { ContentBlocksService } from '@/server/services/content-blocks.service';

export async function PATCH(req: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const json = await req.json();

    await ContentBlocksService.updateFeaturedLessons(json.lessonIds);

    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (error) {
    console.error('Failed to update featured lessons:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
