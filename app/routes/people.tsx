import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

interface LoaderData {
  people: Array<{
    id: number;
    firstName: string;
    lastName: string;
  }>;
}

export const loader: LoaderFunction = () => {
  const people = [
    {
      id: 1,
      firstName: 'James',
      lastName: 'Cooper',
    },
  ];

  return json({ people });
};

export default function PeopleRoute() {
  let { people } = useLoaderData<LoaderData>();
  console.log(people);

  return (
    <main className="flex flex-col items-center">
      <h1 className="min-w-full text-4xl mt-4 mb-4 font-semibold pb-2 border-b border-b-blue-300/25 text-center">
        People
      </h1>

      {people.length > 0 ? (
        <ul>
          {people.map(person => (
            <li key={person.id}>
              <p className="text-2xl">
                {person.firstName} {person.lastName}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center"></p>
      )}

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
