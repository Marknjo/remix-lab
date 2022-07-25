import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, Link, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
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

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  /// Handle form submission
  const userObj = Object.fromEntries(formData);

  console.log(
    typeof userObj.firstName !== 'string' || userObj.firstName !== ''
  );

  invariant(
    typeof userObj.firstName !== 'string' || userObj.firstName !== '',
    'Must provide a first name value as a string'
  );

  invariant(
    typeof userObj.lastName !== 'string' || userObj.lastName !== '',
    'Must provide a last name value as a string'
  );

  /// Create a user with the values

  return null;
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
          className="grid grid-cols-1 py-6 px-4 divide-y divide-slate-200 shadow-sm mw-5/6"
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

      <Form
        method="post"
        className="flex justify-center mt-10 mw-5/6 space-x-4 px-8 py-6 shadow-md border rounded"
      >
        <div className="mb-8 inline-block">
          <input
            aria-label="firstname"
            type="text"
            name="firstName"
            id="firstname"
            className="border border-green-200 rounded-md shadow-sm py-2 px-3 hover:shadow-md hover:border-green-200/80 focus:border-green-600/40 outline-none"
            placeholder="First Name"
          />
        </div>

        <div className="mb-8 inline-block">
          <input
            aria-label="lastname"
            type="text"
            name="lastName"
            id="lastname"
            className="border border-green-200 rounded-md shadow-sm py-2 px-3 hover:shadow-md hover:border-green-200/80 focus:border-green-600/40 outline-none"
            placeholder="Last Name"
          />
        </div>

        <div className="mb-8 inline-block">
          <button className="bg-green-200 rounded-md py-2 px-8 font-semibold text-green-800 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 active:translate-y-[0.3]">
            Add
          </button>
        </div>
      </Form>

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
