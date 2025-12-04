'use client';

import { usePosts } from './hooks/usePosts';
import { Post } from './Post';

export const Feed = ({}: Props) => {
  const { queryPosts } = usePosts();

  if (queryPosts.isPending) {
    return <div>Ładowanie</div>;
  }

  if (queryPosts.isError) {
    return <div>Błąd</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-4 space-y-4">
      {queryPosts.data.pages.map((page, index) =>
        page.data.map((post) => (
          <Post
            key={post.id}
            title={post.title}
            content={post.content}
            author={`${post.author.firstName} ${post.author.lastName}`}
            createdAt={post.createdAt}
          />
        ))
      )}
    </div>
  );
};
