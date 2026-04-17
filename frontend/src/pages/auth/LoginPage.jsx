function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8081/oauth2/authorization/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#FFF8F3" }}>
      <div className="bg-white rounded-2xl shadow-md p-10 flex flex-col items-center gap-6 w-full max-w-sm">
        <h1 className="text-3xl font-semibold" style={{ color: "#7C3B0A" }}>Smart Campus</h1>
        <p className="text-gray-500 text-sm">Sign in to continue</p>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center gap-3 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition text-sm font-medium text-gray-700 w-full justify-center"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
