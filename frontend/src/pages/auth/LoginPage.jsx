import { useState } from "react";

function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    setLoading(true);
    window.location.href = "http://localhost:8081/oauth2/authorization/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#FFF8F3" }}>
      <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center gap-6 w-full max-w-sm">
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-3xl font-bold" style={{ color: "#7C3B0A" }}>Smart Campus</h1>
          <p className="text-gray-400 text-sm">Operations Hub</p>
        </div>

        <div className="w-full border-t border-gray-100" />

        <div className="flex flex-col gap-2 w-full text-center">
          <p className="text-gray-600 text-sm">Sign in to access your account</p>
          <p className="text-gray-400 text-xs">Students, Staff and Admins</p>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex items-center gap-3 px-6 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition text-sm font-medium text-gray-700 w-full justify-center disabled:opacity-50"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          )}
          {loading ? "Redirecting..." : "Continue with Google"}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Only authorized campus members can access this system.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
