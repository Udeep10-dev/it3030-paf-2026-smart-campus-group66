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
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#FFF8F3" }}>
      <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-10 flex flex-col items-center gap-6 w-full max-w-sm">
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-3xl font-semibold" style={{ color: "#7C3B0A" }}>Smart Campus</h1>
          <p className="text-orange-300 text-sm">Operations Hub</p>
        </div>

        <div className="w-full border-t border-orange-100" />

        <div className="flex flex-col gap-1 w-full text-center">
          <p className="text-stone-600 text-sm">Sign in to access your account</p>
          <p className="text-orange-300 text-xs">Students · Staff · Admins</p>
        </div>

        {error && (
          <div className="w-full bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-xs text-red-600 text-center">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex items-center gap-3 px-6 py-3 rounded-lg border border-orange-200 bg-orange-50 hover:bg-orange-100 transition text-sm font-semibold text-orange-900 w-full justify-center disabled:opacity-50 active:scale-95"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          )}
          {loading ? "Signing in..." : "Continue with Google"}
        </button>

        <p className="text-xs text-orange-300 text-center">
          Only authorized campus members can access this system.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
