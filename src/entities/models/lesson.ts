export type Lesson = {
  id: number;
  name: string;
  slug: string;
  description: string;
  video?: {
    privatePlaybackId?: string;
    publicPlaybakcId?: string;
    duration?: number;
  };
  thumbnail: string;
};

export type LessonInsert = {
  name: string;
  slug: string;
  description: string;
  videoId?: number;
  thumbnailId: number;
};
