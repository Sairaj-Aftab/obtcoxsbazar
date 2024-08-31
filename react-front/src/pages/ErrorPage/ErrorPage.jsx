import { Link, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-100 text-center px-6">
      <h1 className="text-8xl font-extrabold mb-4 text-red">Oops!</h1>
      <p className="text-2xl md:text-4xl font-bold mb-2 text-gray-800">
        Uh-oh, you&apos;re lost in space!
      </p>
      <p className="text-lg mb-8 text-gray-600">
        Looks like you&apos;ve found a page that doesn’t exist.
      </p>
      <div className="mb-8">
        <img
          src="https://i.giphy.com/MDJ9IbxxvDUQM.webp"
          alt="Confused astronaut"
          className="w-full"
        />
      </div>
      <p className="italic text-md text-gray-800 mb-8">
        {error?.statusText ||
          error?.message ||
          "Even the astronaut is confused..."}
      </p>
      <Link
        to={"/"}
        className="px-8 py-3 bg-primary-color text-white font-bold rounded-full shadow-lg"
      >
        Beam me back home!
      </Link>
    </div>
  );
};

export default ErrorPage;
