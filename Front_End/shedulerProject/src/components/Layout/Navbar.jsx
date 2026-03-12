import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-gray-800 text-white shadow-md">

      <h1 className="text-2xl font-bold text-blue-400">
        TaskScheduler
      </h1>

      <div className="space-x-4">
        <Link
          to="/login"
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
        >
          Sign In
        </Link>

        <Link
          to="/register"
          className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
        >
          Sign Up
        </Link>
      </div>

    </nav>
  );
}

export default Navbar;