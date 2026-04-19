import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex justify-center items-center h-screen" style={{ background: "#FFF8F3" }}>
    <span className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
  </div>;

  if (!user) return <Navigate to="/login" />;

  if (adminOnly && user.role !== "ADMIN") return <Navigate to="/" />;

  return children;
}

export default ProtectedRoute;
