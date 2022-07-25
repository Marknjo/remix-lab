import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, Link, useLoaderData, useTransition } from '@remix-run/react';
import { useEffect, useRef } from 'react';
import invariant from 'tiny-invariant';
import {
  createPerson,
  deletePerson,
  getAllPeople,
} from '~/model/people.server';

interface LoaderData {
  people: Array<{
    id: number;
    firstName: string;
    lastName: string;
  }>;
}

enum ActionTypes {
  CREATE = 'CREATE',
  DELETE = 'DELETE',
}

export const loader: LoaderFunction = async () => {
  const people = await getAllPeople();

  return json({ people });
};

interface ActionData {
  firstName: string;
  lastName: string;
  id: string;
  _action: ActionTypes;
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  /// Handle form submission
  const userObj = Object.fromEntries(formData);

  invariant(
    typeof userObj.firstName !== 'string' || userObj.firstName !== '',
    'Must provide a first name value as a string'
  );

  invariant(
    typeof userObj.lastName !== 'string' || userObj.lastName !== '',
    'Must provide a last name value as a string'
  );

  const submittedPerson = userObj as unknown as ActionData;

  if (submittedPerson._action === ActionTypes.CREATE) {
    /// Create a user with the values

    await createPerson({
      firstName: submittedPerson.firstName,
      lastName: submittedPerson.lastName,
    });
  }

  if (submittedPerson._action === ActionTypes.DELETE) {
    console.log({ id: submittedPerson.id });

    /// Delete user
    const isPersonDeleted = await deletePerson(submittedPerson.id);

    if (!isPersonDeleted) {
      throw json(`User with the id ${submittedPerson.id} not deleted`, {
        status: 400,
      });
    }
  }

  return null;
};

export default function PeopleRoute() {
  let { people } = useLoaderData<LoaderData>();

  const transition = useTransition();

  const createFormRef = useRef<HTMLFormElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);

  const isAdding =
    transition.state === 'submitting' &&
    transition.submission?.formData.get('_action') === ActionTypes.CREATE;

  useEffect(() => {
    if (!isAdding) {
      createFormRef.current?.reset();
      firstNameRef.current?.focus();
    }
  }, [isAdding]);

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
              <div className="text-lg inline-block space-x-4 py-2">
                <p className="inline-block">
                  {person.firstName} {person.lastName}
                </p>
                <Form method="post" className="inline-block">
                  <input type="hidden" name="id" defaultValue={person.id} />
                  <button
                    name="_action"
                    value={ActionTypes.DELETE}
                    className="text-sm text-red-400 font-bold hover:text-red-500"
                  >
                    X
                  </button>
                </Form>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center"></p>
      )}

      <Form
        method="post"
        className="flex justify-center mt-10 mw-5/6 space-x-4 px-8 py-6 shadow-md border rounded"
        ref={createFormRef}
      >
        <div className="mb-8 inline-block">
          <input
            aria-label="firstname"
            ref={firstNameRef}
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
          <button
            name="_action"
            value={ActionTypes.CREATE}
            disabled={!!isAdding}
            className="bg-green-200 rounded-md py-2 px-8 font-semibold text-green-800 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 active:translate-y-[0.3]"
          >
            {isAdding ? 'Adding...' : 'Add'}
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
