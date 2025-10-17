// src/pages/TwoFAPrompt.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";

const API_BASE = import.meta.env?.VITE_API_BASE || "";

export default function TwoFAPrompt({ setUser }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();
  const loc = useLocation();

  // Accept tempToken from router state OR from ?token=… as a fallback
  const stateToken = loc.state?.tempToken;
  const queryToken = useMemo(() => {
    try {
      const u = new URL(window.location.href);
      return u.searchParams.get("token") || "";
    } catch {
      return "";
    }
  }, []);
  const tempToken = stateToken || queryToken || "";

  useEffect(() => {
    // Tiny UX: focus the input on mount
    const el = document.getElementById("twofa-code");
    if (el) el.focus();
  }, []);

  const onChangeCode = (e) => {
    // Allow only digits, keep max 6
    const v = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(v);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!tempToken) {
      setErr("Missing 2FA token. Please login again.");
      return;
    }
    if (code.length !== 6) {
      setErr("Enter the 6-digit code from your authenticator app.");
      return;
    }

    setErr("");
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE}/api/auth/2fa/login`, {
        tempToken,
        code,
      });

      // Expect: { token, role, email }
      if (!data?.token || !data?.role || !data?.email) {
        throw new Error("Invalid 2FA response from server");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", (data.role || "").toLowerCase());
      localStorage.setItem("email", data.email);

      setUser?.({ token: data.token, role: (data.role || "").toLowerCase(), email: data.email });

      // Route by role
      const role = String(data.role || "").toLowerCase();
      nav(role === "admin" ? "/admin" : "/wallet", { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.error || e?.message || "Invalid code.");
    } finally {
      setLoading(false);
    }
  };

  if (!tempToken) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow bg-white">
        <h2 className="text-xl font-bold mb-3">Two-Factor Authentication</h2>
        <p className="text-gray-700 mb-4">
          Missing 2FA session. Please <Link to="/login" className="text-blue-600 hover:underline">log in</Link> again.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h2 className="text-xl font-bold mb-4">Two-Factor Authentication</h2>
      <p className="text-gray-700 mb-4">
        Enter the 6-digit code from your authenticator app.
      </p>

      <form onSubmit={submit} className="space-y-4">
        <input
          id="twofa-code"
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          value={code}
          onChange={onChangeCode}
          placeholder="123456"
          className="w-full border p-2 rounded tracking-widest text-center text-lg"
          required
        />

        {err && <p className="text-red-600">{err}</p>}

        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className={`w-full p-2 rounded text-white ${loading || code.length !== 6
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-kahawa-dark hover:bg-kahawa-brown"
          }`}
        >
          {loading ? "Verifying…" : "Verify"}
        </button>

        <div className="text-sm text-gray-600 mt-2">
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to login
          </Link>
        </div>
      </form>
    </div>
  );
}
