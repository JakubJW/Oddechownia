import { createformSchema } from '@/features/admin/Lesson/Form/schema';
import { encodeCursor } from '@/lib/utils';
import { createLesson } from '@/server/actions/lesson';
import { LessonFilters, SortOrder } from '@/server/services/filters.service';
import { LessonsService } from '@/server/services/lessons.service';
import { NextRequest, NextResponse } from 'next/server';

const getQueryParams = (url: string) => {
  return Object.fromEntries(new URL(url).searchParams);
};

export async function GET(req: NextRequest) {
  const query = getQueryParams(req.url);
  const filters: LessonFilters = {};

  if (query['search']) {
    filters.search = query['search'] as string;
  }

  if (query['sortBy']) {
    filters.sortBy = query['sortBy'] as string;
  } else {
    filters.sortBy = 'name';
  }

  if (query['sortOrder']) {
    filters.sortOrder = query['sortOrder'] as SortOrder;
  }

  const lessons = await LessonsService.getLessonsList(filters);

  return NextResponse.json(
    {
      data: lessons,
      nextCursor:
        lessons.length === 3
          ? encodeCursor(lessons[lessons.length - 1].createdAt)
          : null,
    },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = createformSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ message: 'Bad request' }, { status: 400 });
  }

  const lesson = await createLesson(parsed.data);

  return NextResponse.json(
    {
      ...lesson,
    },
    { status: 200 }
  );
}
