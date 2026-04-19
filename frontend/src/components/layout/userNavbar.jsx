import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../common/NotificationBell";

function UserNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="flex w-full items-center justify-between border-b border-orange-100 bg-white px-6 py-3 shadow-sm">
      <span className="text-lg font-semibold" style={{ color: "#7C3B0A" }}>
        Smart Campus
      </span>

      <div className="flex items-center gap-4">
        <NotificationBell />
        <span className="text-sm font-medium text-stone-600">{user.name}</span>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-sm font-semibold text-orange-900 transition hover:bg-orange-100 active:scale-95"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default UserNavbar;