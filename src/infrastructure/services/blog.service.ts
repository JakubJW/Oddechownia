import { client } from '@/sanity/client';
import { Post, Category, PostCardDTO, CategoryDTO } from '@/types/blog';
import { transformPostsToCardDTOs, transformCategories } from './blog.dto';

export const getPosts = async (): Promise<Post[]> => {
  const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, lead, image, slug, publishedAt, "category": category->{title}}`;

  const result = await client.fetch<Post[]>(POSTS_QUERY);

  return result;
};

export const getPostsAsCardDTOs = async (): Promise<PostCardDTO[]> => {
  const posts = await getPosts();
  return transformPostsToCardDTOs(posts);
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{_id, title, image, slug, publishedAt, body}`;

  const result = await client.fetch<Post | null>(POST_QUERY, { slug });

  return result;
};

export const getCategories = async (): Promise<Category[]> => {
  const CATEGORIES_QUERY = `*[_type == "category"]|order(title desc)[0...12]{_id, title, slug}`;

  const result = await client.fetch<Category[]>(CATEGORIES_QUERY);

  return result;
};

export const getCategoriesAsDTO = async (): Promise<CategoryDTO[]> => {
  const categories = await getCategories();
  return transformCategories(categories);
};
