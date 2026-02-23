export type Playlist = {
  id: number;
  name: string;
  slug: string;
  isPublished: boolean;
  video?: {
    publicPlaybackId?: string;
    privatePlaybakcId?: string;
  };
};

export type PlaylistInsert = {
  name: string;
  slug: string;
  isPublished: boolean;
  videoId?: number;
};
