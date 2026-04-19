import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { error } = useAuth();

  const handleGoogleLogin = () => {
    setLoading(true);
    window.location.href = "http://localhost:8081/oauth2/authorization/google";
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #e0e7ff 100%)", fontFamily: "'Inter', sans-serif" }}>

      {/* Card */}
      <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 8px 40px rgba(59,130,246,0.12)", padding: "44px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 24, width: "100%", maxWidth: 380 }}>

        {/* Logo area */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg, #3b82f6, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "0 4px 14px rgba(99,102,241,0.3)" }}>
            🏛️
          </div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1e3a5f", letterSpacing: "-0.3px" }}>Smart Campus</h1>
          <p style={{ margin: 0, fontSize: 13, color: "#93c5fd", fontWeight: 500 }}>Operations Hub</p>
        </div>

        <div style={{ width: "100%", height: 1, background: "#eff6ff" }} />

        {/* Subtitle */}
        <div style={{ textAlign: "center" }}>
          <p style={{ margin: "0 0 4px", fontSize: 14, color: "#475569", fontWeight: 500 }}>Sign in to access your account</p>
          <p style={{ margin: 0, fontSize: 12, color: "#93c5fd" }}>Students · Staff · Admins</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ width: "100%", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 14px", fontSize: 12, color: "#dc2626", textAlign: "center" }}>
            {error}
          </div>
        )}

        {/* Google button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            width: "100%", padding: "12px 20px", borderRadius: 10,
            border: "1.5px solid #bfdbfe",
            background: loading ? "#eff6ff" : "#fff",
            color: "#1d4ed8", fontSize: 14, fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all .2s", boxShadow: "0 1px 4px rgba(59,130,246,0.08)",
            opacity: loading ? 0.7 : 1
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#eff6ff"; }}
          onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#fff"; }}
        >
          {loading ? (
            <span style={{ width: 18, height: 18, border: "2px solid #93c5fd", borderTop: "2px solid #3b82f6", borderRadius: "50%", display: "inline-block", animation: "spin .7s linear infinite" }} />
          ) : (
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: 18, height: 18 }} />
          )}
          {loading ? "Signing in..." : "Continue with Google"}
        </button>

        <p style={{ margin: 0, fontSize: 11, color: "#bfdbfe", textAlign: "center" }}>
          Only authorized campus members can access this system.
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default LoginPage;
