import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// allowedRoles: array like ["ADMIN"] or ["ADMIN","STAFF"] or omit for any logged-in user
function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#eff6ff" }}>
      <div style={{ width: 32, height: 32, border: "3px solid #bfdbfe", borderTop: "3px solid #2563eb", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role?.toUpperCase?.())) {
    if (user.role === "ADMIN") return <Navigate to="/admin/notifications" replace />;
    if (user.role === "STAFF") return <Navigate to="/tickets" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
