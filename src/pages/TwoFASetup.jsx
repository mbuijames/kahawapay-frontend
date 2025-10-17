// src/pages/TwoFASetup.jsx
import React, { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env?.VITE_API_BASE || "";

export default function TwoFASetup() {
  const [qr, setQr] = useState("");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const token = localStorage.getItem("token") || "";
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const start = async () => {
    setErr("");
    setMsg("");
    if (!token) {
      setErr("You must be logged in to enable 2FA.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE}/api/auth/2fa/setup`, {}, { headers });
      if (!data?.qr) throw new Error("Server did not return a QR image.");
      setQr(data.qr);
      setMsg("Scan this QR in Google Authenticator, then enter the 6-digit code.");
    } catch (e) {
      setErr(e?.response?.data?.error || e?.message || "Failed to start 2FA setup.");
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    setErr("");
    setMsg("");
    if (!token) {
      setErr("You must be logged in to enable 2FA.");
      return;
    }
    const trimmed = String(code || "").trim();
    if (!/^\d{6}$/.test(trimmed)) {
      setErr("Please enter a valid 6-digit code.");
      return;
    }
    setVerifying(true);
    try {
      await axios.post(`${API_BASE}/api/auth/2fa/verify`, { token: trimmed }, { headers });
      setMsg("✅ Two-factor authentication enabled.");
    } catch (e) {
      setErr(e?.response?.data?.error || "Failed to verify code.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-2">Enable 2-Factor Authentication</h2>
      <p className="text-gray-600 mb-4">
        Protect your account with a 6-digit code from Google Authenticator or another TOTP app.
      </p>

      {!qr ? (
        <button
          onClick={start}
          disabled={loading}
          className="w-full py-2 rounded-md bg-kahawa-dark text-white hover:bg-kahawa-brown disabled:opacity-60"
        >
          {loading ? "Generating…" : "Generate QR"}
        </button>
      ) : (
        <>
          <div className="flex justify-center my-4">
            <img src={qr} alt="2FA QR Code" className="w-52 h-52 border rounded-lg shadow" />
          </div>

          <input
            type="text"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength={6}
            className="w-full border border-gray-300 rounded-md p-2 mb-3 text-center text-lg tracking-widest"
          />

          <button
            onClick={verify}
            disabled={verifying || code.length !== 6}
            className="w-full py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
          >
            {verifying ? "Verifying…" : "Verify & Enable"}
          </button>
        </>
      )}

      {msg && <p className="text-green-700 mt-3">{msg}</p>}
      {err && <p className="text-red-600 mt-3">{err}</p>}
    </div>
  );
}
