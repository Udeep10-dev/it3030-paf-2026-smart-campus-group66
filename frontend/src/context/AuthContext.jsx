import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const errorParam = params.get("error");

    if (errorParam) {
      const messages = {
        user_not_found: "Account not found. Please contact your administrator.",
        server_error: "Server error during login. Please try again.",
        oauth_failed: "Google login failed. Please try again.",
      };
      setError(messages[errorParam] || "Login failed. Please try again.");
      window.history.replaceState({}, "", window.location.pathname);
      setLoading(false);
      return;
    }

    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, "", window.location.pathname);
    }

    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      api.get("/auth/me", {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
        .then(res => {
          setUser(res.data);
          if (token) {
            const role = res.data.role;
            const intent = sessionStorage.getItem("loginIntent");
            sessionStorage.removeItem("loginIntent");

            if (intent === "admin" && role !== "ADMIN") {
              setError("This account does not have admin access.");
              localStorage.removeItem("token");
              setLoading(false);
              return;
            }
            if (intent === "staff" && role !== "STAFF") {
              setError("This account does not have staff access.");
              localStorage.removeItem("token");
              setLoading(false);
              return;
            }

            if (role === "ADMIN") navigate("/admin/notifications");
            else if (role === "STAFF") navigate("/tickets");
            else navigate("/dashboard");
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          setError("Session expired. Please login again.");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const isAdmin = () => user?.role === "ADMIN";
  const isStaff = () => user?.role === "STAFF";
  const isStudent = () => user?.role === "STUDENT";

  return (
    <AuthContext.Provider value={{ user, loading, error, logout, isAdmin, isStaff, isStudent }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
