import { BlogCard } from '@/components/BlogCard';

const mockBlogPosts = [
  {
    id: 1,
    title: 'Lorem ipsum dolor sit amet, consectetur?',
    slug: 'siema',
    description: 'Lorem ipsum dolor sit amet, consectetur?',
    image:
      'https://wknpvvtasrhwkqmkvoml.supabase.co/storage/v1/object/public/Public/images/pexels-pixabay-460307.jpg',
    createdAt: '09 mar 2025',
  },
  {
    id: 2,
    title: 'Lorem ipsum dolor sit amet, consectetur?',
    slug: 'siema',
    description: 'Lorem ipsum dolor sit amet, consectetur?',
    image:
      'https://wknpvvtasrhwkqmkvoml.supabase.co/storage/v1/object/public/Public/images/pexels-pixabay-460307.jpg',
    createdAt: '09 mar 2025',
  },
  {
    id: 3,
    title: 'Lorem ipsum dolor sit amet, consectetur?',
    slug: 'Lorem ipsum dolor sit amet, consectetur?',
    description: 'elo',
    image:
      'https://wknpvvtasrhwkqmkvoml.supabase.co/storage/v1/object/public/Public/images/pexels-pixabay-460307.jpg',
    createdAt: '09 mar 2025',
  },
  {
    id: 4,
    title: 'Lorem ipsum dolor sit amet, consectetur?',
    slug: 'Lorem ipsum dolor sit amet, consectetur?',
    description: 'elo',
    image:
      'https://wknpvvtasrhwkqmkvoml.supabase.co/storage/v1/object/public/Public/images/pexels-pixabay-460307.jpg',
    createdAt: '09 mar 2025',
  },
];

export default function Blog() {
  return (
    <div className='grid grid-cols-3 gap-6'>
      {mockBlogPosts.map(
        ({ id, title, slug, description, image, createdAt }, index) => (
          <BlogCard
            id={id}
            key={index}
            title={title}
            slug={slug}
            description={description}
            image={image}
            createdAt={createdAt}
          />
        )
      )}
    </div>
  );
}
