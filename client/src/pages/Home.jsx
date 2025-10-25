import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 px-6 text-center">
      {/* Welcome Message */}
      <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
        Welcome to My Blog
      </h1>
      <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-xl">
        Discover amazing articles, latest tech insights, and tutorials. Join our community today!
      </p>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        <Link
          to="/login"
          className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-8 py-3 border border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-600 hover:text-white transition"
        >
          Register
        </Link>
      </div>

    </div>
  );
}
