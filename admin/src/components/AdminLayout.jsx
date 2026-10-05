import { Link, Outlet, useNavigate } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-blue-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r min-h-screen p-5">
        <h1 className="text-2xl font-bold text-blue-600 mb-8">
          Portfolio CMS
        </h1>

        <nav className="space-y-2">
          <Link
            to="/dashboard"
            className="block px-4 py-3 rounded-lg hover:bg-blue-50"
          >
            Dashboard
          </Link>

          <Link
            to="/about"
            className="block px-4 py-3 rounded-lg hover:bg-blue-50"
          >
            About
          </Link>

          <Link
            to="/skills"
            className="block px-4 py-3 rounded-lg hover:bg-blue-50"
          >
            Skills
          </Link>

          <Link
            to="/projects"
            className="block px-4 py-3 rounded-lg hover:bg-blue-50"
          >
            Projects
          </Link>

          <Link
            to="/blogs"
            className="block px-4 py-3 rounded-lg hover:bg-blue-50"
          >
            Blogs
          </Link>

          <Link
            to="/experience"
            className="block px-4 py-3 rounded-lg hover:bg-blue-50"
          >
            Experience
          </Link>

          <Link
            to="/testimonials"
            className="block px-4 py-3 rounded-lg hover:bg-blue-50"
          >
            Testimonials
          </Link>

          <Link
            to="/services"
            className="block px-4 py-3 rounded-lg hover:bg-blue-50"
          >
            Services
          </Link>

          <Link
            to="/media"
            className="block px-4 py-3 rounded-lg hover:bg-blue-50"
          >
            Media
          </Link>

          <Link
            to="/messages"
            className="block px-4 py-3 rounded-lg hover:bg-blue-50"
          >
            Messages
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-8 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
