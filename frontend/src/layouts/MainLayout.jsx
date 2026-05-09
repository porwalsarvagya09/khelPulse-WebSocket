import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;