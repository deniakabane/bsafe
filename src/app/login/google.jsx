"use client";
import { useState } from "react";

export default function Login() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    // Redirect to the backend API for Google login authentication
    window.location.href = "/api/public/login/google";
  };

  return (
    <div>
      <h1>Login with Google</h1>
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login with Google"}
      </button>
    </div>
  );
}
