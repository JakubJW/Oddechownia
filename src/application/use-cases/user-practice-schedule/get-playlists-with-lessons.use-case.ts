import { IPlaylistsRepository } from '@/application/repositories/playlists.repository.interface';

export class GetPlaylistsWithLessonsUseCase {
  constructor(private playlistsRepository: IPlaylistsRepository) {}

  async execute() {
    const result = this.playlistsRepository.getPublishedPlaylistsWithLessons();

    return result;
  }
}
