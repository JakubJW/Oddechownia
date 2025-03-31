import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { getCourses } from '@/actions/course';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kursy | Admin | Oddechownia',
};

export default async function AdminCourses() {
  const courses = await getCourses();

  if (!courses) {
    return (
      <div className="text-red-500">
        Failed to load courses. Please try again later.
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between mb-8">
        <h1>Kursy</h1>
        <Link
          href="/admin/kursy/dodaj"
          className={buttonVariants({ variant: 'default' })}
        >
          Dodaj kurs
        </Link>
      </div>
      {courses.length === 0 ? (
        <div>
          <h3>Nie masz jeszcze żadnych kursów</h3>
        </div>
      ) : (
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
                Nazwa
              </th>
              <th
                scope="col"
                className="px-6 py-3"
              >
                Opis
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
            {courses.map(({ id, name, description, slug, lessons }) => (
              <tr
                key={id}
                className="bg-white border-b border-gray-200"
              >
                <td className="px-6 py-4">
                  <img
                    src={`https://image.mux.com/${lessons[0]?.video?.publicPlaybackId}/thumbnail.jpg?width=640`}
                    alt=""
                    width={640}
                    className="rounded-lg"
                  />
                </td>
                <td className="px-6 py-4">
                  <p className="line-clamp-2">{name}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="line-clamp-2">{description}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex">
                    <Link
                      className="mr-4"
                      href={`/admin/kurs/${slug}`}
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
      )}
    </div>
  );
}
