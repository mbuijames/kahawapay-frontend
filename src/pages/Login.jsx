// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api";

export default function Login({ setUser }) {
  const [formEmail, setFormEmail] = useState("");  // <-- renamed to avoid collisions
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginUser(formEmail.trim(), password);

      // 2FA gating: backend may return { requires2fa: true, tempToken }
      if (result?.requires2fa && result?.tempToken) {
        navigate("/2fa", {
          state: { tempToken: result.tempToken, email: formEmail.trim() },
          replace: true,
        });
        return;
      }

      // Normal login path
      const token = result.token;
      const role = (result.role || "").toLowerCase();
      const userEmail = result.email; // <-- different name than formEmail

      // Persist
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("email", userEmail);

      // Lift state up
      setUser?.({ token, role, email: userEmail });

      // Route by role
      navigate(role === "admin" ? "/admin" : "/wallet", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
      <p className="text-gray-600 mb-6">Sign in to continue to KahawaPay.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
            placeholder="you@domain.com"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-700"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-700"
            required
            autoComplete="current-password"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex items-center justify-between text-sm">
          <Link to="/forgot" className="text-amber-800 hover:underline">Forgot password?</Link>
          <Link to="/register" className="text-amber-800 hover:underline">Create account</Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-amber-900 text-white hover:bg-amber-800 disabled:opacity-60"
        >
          {loading ? "Logging in…" : "Login"}
        </button>
      </form>
    </div>
  );
}
