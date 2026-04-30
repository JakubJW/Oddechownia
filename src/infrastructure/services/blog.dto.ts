import { urlFor } from '@/sanity/imageUrlBuilder';
import { Post, Category, PostCardDTO, CategoryDTO } from '@/types/blog';

/**
 * Transform raw Post to PostCardDTO
 * Handles image URL generation and data extraction
 */
export function transformPostToCardDTO(post: Post): PostCardDTO {
  return {
    id: post._id,
    slug: post.slug.current,
    title: post.title,
    lead: post.lead,
    publishedAt: post.publishedAt,
    image: post.image ? urlFor(post.image).url() : null,
    category: post.category?.title,
  };
}

/**
 * Transform raw Category to CategoryDTO
 */
export function transformCategory(category: Category): CategoryDTO {
  return {
    id: category._id,
    title: category.title,
    slug: category.slug.current,
  };
}

/**
 * Transform array of Posts to PostCardDTOs
 */
export function transformPostsToCardDTOs(posts: Post[]): PostCardDTO[] {
  return posts.map(transformPostToCardDTO);
}

/**
 * Transform array of Categories to CategoryDTOs
 */
export function transformCategories(categories: Category[]): CategoryDTO[] {
  return categories.map(transformCategory);
}
