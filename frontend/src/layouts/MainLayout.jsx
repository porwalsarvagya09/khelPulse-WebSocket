import { Outlet, Link } from "react-router-dom";

function MainLayout() {
  return (
    <div className="min-h-screen bg-black text-white">
      
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          
          <Link
            to="/"
            className="text-2xl font-bold text-green-400"
          >
            KhelPulse
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="hover:text-green-400 transition"
            >
              Home
            </Link>

            <Link
              to="/admin/login"
              className="hover:text-green-400 transition"
            >
              Admin
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;