import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { error } = useAuth();

  const handleLogin = () => {
    setLoading(true);
    window.location.href = "http://localhost:8081/oauth2/authorization/google";
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)", fontFamily: "'Inter',sans-serif" }}>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#818cf8,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🏛️</div>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>Smart Campus</h1>
          <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.35)" }}>Operations Hub</p>
        </div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)", borderRadius: 24, border: "1px solid rgba(255,255,255,0.1)", padding: "44px 40px", width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎓</div>
          <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 700, color: "#fff" }}>Welcome</h2>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Sign in to access Smart Campus</p>
        </div>

        {error && (
          <div style={{ width: "100%", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#fca5a5", textAlign: "center" }}>
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, width: "100%", padding: "13px 20px", borderRadius: 12, border: "none", background: loading ? "rgba(99,102,241,0.5)" : "linear-gradient(135deg,#818cf8,#6366f1)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 4px 20px rgba(99,102,241,0.35)", transition: "opacity .2s" }}
        >
          {loading ? (
            <span style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", display: "inline-block", animation: "spin .7s linear infinite" }} />
          ) : (
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: 18, height: 18 }} />
          )}
          {loading ? "Signing in..." : "Continue with Google"}
        </button>

        <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
          Only authorized campus members can access this system
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default LoginPage;
