'use client';

import { usePosts } from './hooks/usePosts';
import { Post } from './Post';
import { User } from '@/server/actions/user';

type Props = {
  user: User;
};

export const Feed = ({ user }: Props) => {
  const { queryPosts } = usePosts();

  if (queryPosts.isPending) {
    return <div>Ładowanie</div>;
  }

  if (queryPosts.isError) {
    return <div>Błąd</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-4 space-y-4">
      {queryPosts.data.pages.map((page) =>
        page.data.map((post) => (
          <Post
            key={post.id}
            post={post}
            user={user}
          />
        ))
      )}
    </div>
  );
};
