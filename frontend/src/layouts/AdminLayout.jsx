import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <main className="container mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;