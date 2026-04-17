import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../common/NotificationBell";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="w-full px-6 py-3 flex justify-between items-center bg-white shadow-sm">
      <span className="font-semibold text-lg" style={{ color: "#7C3B0A" }}>Smart Campus</span>
      <div className="flex items-center gap-4">
        <NotificationBell />
        <span className="text-sm text-gray-600">{user.name}</span>
        <button
          onClick={handleLogout}
          className="text-sm px-3 py-1 rounded-lg border hover:bg-gray-50 transition"
          style={{ color: "#7C3B0A", borderColor: "#7C3B0A" }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
