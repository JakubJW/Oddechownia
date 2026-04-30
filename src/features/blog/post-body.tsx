'use client';

import { Image } from 'next-sanity/image';
import { urlFor } from '@/sanity/imageUrlBuilder';
import { PortableText, PortableTextComponents } from 'next-sanity';
import { SanityImage } from '@/types/blog';

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImage }) => {
      if (!value?.asset?._ref) return null;

      return (
        <div className="relative w-full h-96 my-10">
          <Image
            className="object-cover rounded-xl"
            src={urlFor(value).url()}
            alt={value.alt || 'Zdjęcie blogowe'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      );
    },
  },
  // block: {
  //   h1: ({ children }) => (
  //     <h1 className="text-4xl font-bold my-4">{children}</h1>
  //   ),
  //   normal: ({ children }) => (
  //     <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
  //   ),
  // },
  // marks: {
  //   link: ({ children, value }) => {
  //     const rel = !value.href.startsWith('/')
  //       ? 'noreferrer noopener'
  //       : undefined;
  //     return (
  //       <a
  //         href={value.href}
  //         rel={rel}
  //         className="text-blue-500 underline"
  //       >
  //         {children}
  //       </a>
  //     );
  //   },
  // },
};

const DocumentBody = ({ value }: { value: any }) => {
  return (
    <PortableText
      value={value}
      components={components}
    />
  );
};

export default DocumentBody;
