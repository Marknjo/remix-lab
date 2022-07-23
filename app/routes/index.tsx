import { Link } from '@remix-run/react';

export default function Index() {
  return (
    <div className="grid justify-center font-['system-ui, sans-serif'] lending-6 text-gray-800">
      <h1 className="text-4xl mb-4 mt-4">Welcome to Remix</h1>
      <Link
        to="/people"
        className="text-blue-500 hover:text-blue-300 underline underline-offset-2"
      >
        People
      </Link>
    </div>
  );
}
