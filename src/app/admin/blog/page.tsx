import { getPosts } from '@/lib/actions/post';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

export default async function AdminBlog() {
  const posts = await getPosts();

  return (
    <div>
      <div className="flex justify-between mb-8">
        <h1>Blog</h1>
        <Link
          href="/admin/blog/dodaj-artykul"
          className={buttonVariants({ variant: 'default' })}
        >
          Dodaj post
        </Link>
      </div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3"
            >
              Miniaturka
            </th>
            <th
              scope="col"
              className="px-6 py-3"
            >
              Tytuł
            </th>
            <th
              scope="col"
              className="px-6 py-3"
            >
              Data utworzenia
            </th>
            <th
              scope="col"
              className="px-6 py-3"
            >
              Akcje
            </th>
          </tr>
        </thead>
        <tbody>
          {posts.map(({ id, title, createdAt, thumbnailUrl, slug }) => (
            <tr
              key={id}
              className="bg-white border-b border-gray-200"
            >
              <td className="px-6 py-4">
                <img
                  src={thumbnailUrl}
                  alt=""
                  width={150}
                  className="rounded-lg"
                />
              </td>
              <td className="px-6 py-4">{title}</td>
              <td className="px-6 py-4">
                {new Date(createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <div className="flex">
                  <Link
                    className="mr-4"
                    href={`/admin/blog/edytuj-artykul/${slug}`}
                  >
                    Edytuj
                  </Link>
                  <form action="">
                    <button type="submit">Usuń</button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
