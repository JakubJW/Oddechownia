import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/infrastructure/services/user.service';
import { GetPlaylistsWithLessonsUseCase } from '@/application/use-cases/user-practice-schedule/get-playlists-with-lessons.use-case';
import { PlaylistsRepository } from '@/infrastructure/repositories/playlists.repository';

export async function GET(req: NextRequest) {
  try {
    const userService = new UserService();
    const user = await userService.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const useCase = new GetPlaylistsWithLessonsUseCase(
      new PlaylistsRepository()
    );

    const playlists = await useCase.execute();

    return NextResponse.json(playlists, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch calendar events:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
