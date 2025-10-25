import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white shadow-lg z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo / Brand */}
        <Link
          to="/"
          className="text-2xl font-bold text-indigo-400 hover:text-indigo-300 transition"
        >
          My Blog
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:text-indigo-300 transition ${
                isActive ? "text-indigo-400 font-semibold" : ""
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/create"
            className={({ isActive }) =>
              `hover:text-indigo-300 transition ${
                isActive ? "text-indigo-400 font-semibold" : ""
              }`
            }
          >
            Create Post
          </NavLink>
          <NavLink
            to="/view"
            className={({ isActive }) =>
              `hover:text-indigo-300 transition ${
                isActive ? "text-indigo-400 font-semibold" : ""
              }`
            }
          >
            View Posts
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
