/**
 * Raw Sanity document types
 */

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  caption?: string;
  hotspot?: any;
  crop?: any;
}

export interface SanitySlug {
  _type: 'slug';
  current: string;
}

export interface Post {
  _id: string;
  _type: 'post';
  title: string;
  lead: string;
  slug: SanitySlug;
  publishedAt: string;
  image: SanityImage;
  body: any[];
  category?: Category;
}

export interface Category {
  _id: string;
  _type: 'category';
  title: string;
  slug: SanitySlug;
}

/**
 * DTO types for component props
 */

export interface PostCardDTO {
  id: string;
  slug: string;
  title: string;
  lead: string;
  publishedAt: string;
  image: string | null;
  category?: string;
}

export interface CategoryDTO {
  id: string;
  title: string;
  slug: string;
}
