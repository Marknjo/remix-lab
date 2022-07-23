import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { getAllPeople } from '~/model/people.server';

interface LoaderData {
  people: Array<{
    id: number;
    firstName: string;
    lastName: string;
  }>;
}

export const loader: LoaderFunction = async () => {
  const people = await getAllPeople();

  return json({ people });
};

export default function PeopleRoute() {
  let { people } = useLoaderData<LoaderData>();

  return (
    <main className="flex flex-col items-center">
      <h1 className="min-w-full text-4xl mt-4 mb-4 font-semibold pb-2 border-b border-b-blue-300/25 text-center">
        People
      </h1>

      {people.length > 0 ? (
        <ul
          role="presentation"
          className="grid grid-cols-1 py-6 px-4 divide-y divide-slate-200 shadow-md border rounded"
        >
          {people.map(person => (
            <li key={person.id} className="px-8 mb-2">
              <p className="text-lg">
                {person.firstName} {person.lastName}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center"></p>
      )}

      {/* Footer */}
      <div className="mt-8">
        <Link
          to="/"
          className="text-blue-500 hover:text-blue-300 underline underline-offset-2"
        >
          Home
        </Link>
      </div>
    </main>
  );
}
