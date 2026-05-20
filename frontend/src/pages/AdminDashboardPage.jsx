import { useNavigate } from "react-router-dom";

import { removeToken } from "../utils/auth.js";

function AdminDashboardPage() {
  const navigate = useNavigate();

  function handleLogout() {
    removeToken();

    navigate("/admin/login");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        
        <h1 className="text-5xl font-bold">
          Admin Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <p className="text-xl text-gray-300">
          Admin controls coming next.
        </p>
      </div>
    </div>
  );
}

export default AdminDashboardPage;