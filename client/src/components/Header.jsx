import { useAuth } from "../context/authContext";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md rounded-2xl mb-10 ">
      <div className="container mx-auto flex justify-between items-center max-w-7xl">
        <div className="text-xl font-bold">Super Admin</div>

        {/* Navigation Links */}
        <nav className="flex gap-6">
          <Link
            to="/users"
            className={`hover:text-blue-300 transition-colors ${
              location.pathname === "/users" ? "text-blue-200" : ""
            }`}
          >
            Users
          </Link>
          <Link
            to="/audit-logs"
            className={`hover:text-blue-300 transition-colors ${
              location.pathname === "/audit-logs" ? "text-blue-200" : ""
            }`}
          >
            Audit Logs
          </Link>
          <Link
            to="/analytics"
            className={`hover:text-blue-300 transition-colors ${
              location.pathname === "/analytics" ? "text-blue-200" : ""
            }`}
          >
            Analytics
          </Link>
        </nav>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
