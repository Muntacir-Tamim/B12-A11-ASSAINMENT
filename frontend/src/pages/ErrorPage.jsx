import { useNavigate } from "react-router";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="flex flex-col items-center max-w-sm mx-auto text-center">
        <p className="text-8xl font-extrabold text-blue-600 mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-500 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg
              hover:bg-gray-100 transition text-sm font-medium"
          >
            ← Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg
              hover:bg-blue-700 transition text-sm font-semibold"
          >
            Go Home
          </button>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
