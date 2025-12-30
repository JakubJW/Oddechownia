import { desc } from 'drizzle-orm';
import { db } from '../db';
import { posts } from '../db/schema';
import { RecentPostDTO } from '../models/post.models';

const getRecentPosts = async (): Promise<RecentPostDTO[]> => {
  try {
    const result = await db.query.posts.findMany({
      with: {
        author: { columns: { firstName: true, lastName: true, role: true } },
      },
      orderBy: desc(posts.createdAt),
      limit: 3,
    });

    const transformedResult = result.map((post) => ({
      id: post.id,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      title: post.title,
      content: post.content,
      slug: post.slug,
      author: `${post.author.firstName} ${post.author.lastName}`,
    }));

    return transformedResult;
  } catch (error) {
    console.error(error);
    throw new Error('Podczas pobierania postów wystąpił błąd');
  }
};

export const PostsService = {
  getRecentPosts,
};
