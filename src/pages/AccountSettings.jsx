// src/pages/AccountSettings.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env?.VITE_API_BASE || "";

export default function AccountSettings() {
  const [email] = useState(localStorage.getItem("email") || "");
  const [twofaEnabled, setTwofaEnabled] = useState(false);
  const [qr, setQr] = useState("");
  const [code, setCode] = useState("");

  // Change password form state
  const [cp, setCp] = useState({ currentPassword: "", newPassword: "" });
  const [cpLoading, setCpLoading] = useState(false);
  const [cpMsg, setCpMsg] = useState("");
  const [cpErr, setCpErr] = useState("");

  // 2FA messages
  const [tfLoading, setTfLoading] = useState(false);
  const [tfMsg, setTfMsg] = useState("");
  const [tfErr, setTfErr] = useState("");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  };

  useEffect(() => {
    // (Optional) If you later add GET /api/me, initialize twofaEnabled here:
    // axios.get(`${API_BASE}/api/me`, { headers }).then(r => setTwofaEnabled(!!r.data.twofa_enabled));
  }, []);

  /* ---------------------------
     Change Password
  --------------------------- */
  const changePassword = async (e) => {
    e.preventDefault();
    setCpMsg(""); setCpErr("");

    if (!cp.currentPassword || !cp.newPassword) {
      setCpErr("Current and new passwords are required.");
      return;
    }
    if (cp.newPassword.length < 6) {
      setCpErr("New password must be at least 6 characters.");
      return;
    }

    setCpLoading(true);
    try {
      await axios.post(`${API_BASE}/api/auth/change-password`, cp, { headers });
      setCpMsg("Password changed successfully.");
      setCp({ currentPassword: "", newPassword: "" });
    } catch (e2) {
      setCpErr(e2?.response?.data?.error || "Failed to change password.");
    } finally {
      setCpLoading(false);
    }
  };

  /* ---------------------------
     2FA: Setup / Verify / Disable
  --------------------------- */
  const start2FA = async () => {
    setTfMsg(""); setTfErr(""); setQr("");
    setTfLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE}/api/auth/2fa/setup`, {}, { headers });
      setQr(data.qr);
    } catch (e2) {
      setTfErr(e2?.response?.data?.error || "Failed to start 2FA setup.");
    } finally {
      setTfLoading(false);
    }
  };

  const verify2FA = async (e) => {
    e.preventDefault();
    setTfMsg(""); setTfErr("");
    if (!code || code.length !== 6) {
      setTfErr("Enter the 6-digit code from your authenticator app.");
      return;
    }
    setTfLoading(true);
    try {
      await axios.post(`${API_BASE}/api/auth/2fa/verify`, { token: code }, { headers });
      setTwofaEnabled(true);
      setTfMsg("Two-factor authentication enabled.");
      setQr("");
      setCode("");
    } catch (e2) {
      setTfErr(e2?.response?.data?.error || "Invalid code.");
    } finally {
      setTfLoading(false);
    }
  };

  const disable2FA = async () => {
    setTfMsg(""); setTfErr("");
    setTfLoading(true);
    try {
      await axios.post(`${API_BASE}/api/auth/2fa/disable`, {}, { headers });
      setTwofaEnabled(false);
      setTfMsg("Two-factor authentication disabled.");
      setQr("");
      setCode("");
    } catch (e2) {
      setTfErr(e2?.response?.data?.error || "Failed to disable 2FA.");
    } finally {
      setTfLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-gray-600 mt-1">
            Signed in as <span className="font-medium">{email}</span>
          </p>
        </div>
        <div
          className={`px-2 py-1 rounded text-sm self-start ${
            twofaEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
          }`}
          title="Two-Factor Authentication status"
        >
          {twofaEnabled ? "2FA enabled" : "2FA disabled"}
        </div>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile / Security card */}
        <aside className="card lg:sticky lg:top-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-kahawa-dark text-white flex items-center justify-center text-xl font-semibold">
              {email.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <div className="text-sm text-gray-500">Email</div>
              <div className="font-medium">{email}</div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="border-t" />
            <div className="text-sm text-gray-500">Security tips</div>
            <ul className="text-sm list-disc pl-5 space-y-1 text-gray-700">
              <li>Use a unique, strong password.</li>
              <li>Enable 2FA to protect your account.</li>
            </ul>
          </div>
        </aside>

        {/* Change Password */}
        <section className="card lg:col-span-2">
          <h2 className="text-xl font-semibold">Change Password</h2>
          <p className="text-sm text-gray-600 mt-1">
            Update your password. You’ll use the new password next time you sign in.
          </p>

          {/* Messages */}
          {cpMsg && (
            <div className="mt-4 p-3 rounded bg-green-50 text-green-700 border border-green-200">
              {cpMsg}
            </div>
          )}
          {cpErr && (
            <div className="mt-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">
              {cpErr}
            </div>
          )}

          <form onSubmit={changePassword} className="mt-6 grid gap-5 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current password
              </label>
              <input
                type="password"
                className="input"
                placeholder="Enter current password"
                value={cp.currentPassword}
                onChange={(e) => setCp((s) => ({ ...s, currentPassword: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New password
              </label>
              <input
                type="password"
                className="input"
                placeholder="At least 6 characters"
                value={cp.newPassword}
                onChange={(e) => setCp((s) => ({ ...s, newPassword: e.target.value }))}
                required
              />
            </div>

            <div className="pt-1">
              <button type="submit" className="btn-primary" disabled={cpLoading}>
                {cpLoading ? "Updating…" : "Update Password"}
              </button>
            </div>
          </form>
        </section>

        {/* Break to avoid overlap on wide layouts */}
        <div className="lg:col-span-3" />

        {/* Two-Factor Authentication */}
        <section className="card lg:col-span-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Two-Factor Authentication</h2>
              <p className="text-sm text-gray-600 mt-1">
                Use an authenticator app (e.g., Google Authenticator) to require a 6-digit code when you sign in.
              </p>
            </div>

            <div className="flex gap-2">
              {!twofaEnabled && !qr && (
                <button className="btn-primary" onClick={start2FA} disabled={tfLoading}>
                  {tfLoading ? "Preparing…" : "Start 2FA Setup"}
                </button>
              )}
              {twofaEnabled && (
                <button className="btn-outline" onClick={disable2FA} disabled={tfLoading}>
                  Disable 2FA
                </button>
              )}
            </div>
          </div>

          {/* Messages */}
          {tfMsg && (
            <div className="mt-4 p-3 rounded bg-green-50 text-green-700 border border-green-200">
              {tfMsg}
            </div>
          )}
          {tfErr && (
            <div className="mt-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">
              {tfErr}
            </div>
          )}

          {/* Setup flow */}
          {!twofaEnabled && qr && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* QR column */}
              <div className="space-y-3">
                <div className="text-sm text-gray-700">1) Scan this QR with your authenticator app</div>
                <div className="rounded border p-3 bg-white shadow-sm inline-block">
                  <img
                    src={qr}
                    alt="2FA QR"
                    className="h-52 w-52 object-contain block"
                  />
                </div>
                <div className="text-xs text-gray-500">
                  Can’t scan? Most apps let you enter the key manually after scanning.
                </div>
              </div>

              {/* Code verify column */}
              <form onSubmit={verify2FA} className="grid gap-3 content-start">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  2) Enter the 6-digit code
                </label>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="123456"
                  maxLength={6}
                  className="input max-w-xs text-center tracking-widest text-lg"
                  required
                />
                <div className="pt-1">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={tfLoading || code.length !== 6}
                  >
                    {tfLoading ? "Verifying…" : "Verify & Enable"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
