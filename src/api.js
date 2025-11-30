// src/api.js
import axios from "axios";
import { jwtDecode } from "jwt-decode";

/* ------------------------------------------
 * BASE URL (no /api here)
 * ------------------------------------------ */
const API_BASE = import.meta.env?.VITE_API_BASE || "http://localhost:5000";

export const api = axios.create({ baseURL: API_BASE });

/* Guest transaction limit (for UI only) */
export const GUEST_TX_LIMIT_USD = Number(import.meta.env?.VITE_GUEST_TX_LIMIT_USD ?? 100);

/* ------------------------------------------
 * AUTH API CALLS (REGISTER + OTP + LOGIN)
 * ------------------------------------------ */

// 1️⃣ REGISTER USER → backend generates OTP + emails it
export async function registerUser(email, password) {
  try {
    const { data } = await api.post(
      `/api/auth/register`,
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );
    return data; // { message: "...", otpSent: true }
  } catch (err) {
    const msg =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      "Registration failed. Please try again.";

    console.error("🔥 registerUser error:", msg);
    throw new Error(msg);
  }
}

// 2️⃣ VERIFY OTP
export async function verifyOtp(email, otp) {
  try {
    const { data } = await api.post(
      `/api/auth/verify-otp`,
      { email, otp },
      { headers: { "Content-Type": "application/json" } }
    );
    return data; // { verified: true }
  } catch (err) {
    const msg =
      err?.response?.data?.error ||
      "OTP verification failed. Try again.";
    throw new Error(msg);
  }
}

// 3️⃣ LOGIN USER
export async function loginUser(email, password) {
  try {
    const { data } = await api.post(
      `/api/auth/login`,
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );

    // support 2FA if backend uses it
    if (data?.requires2fa && data?.tempToken) {
      return { requires2fa: true, tempToken: data.tempToken, email };
    }

    const { token, role, email: userEmail } = data || {};
    if (!token || !role || !userEmail) {
      throw new Error("Invalid login response from server");
    }

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("email", userEmail);
    setAuth(token);

    return { token, role, email: userEmail };
  } catch (err) {
    const msg =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      "Login failed. Please try again.";

    console.error("🔥 loginUser error:", msg);
    throw new Error(msg);
  }
}

/* ------------------------------------------
 * AUTH TOKEN HELPERS
 * ------------------------------------------ */
export function setAuth(token) {
  if (token) {
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  }
}

export function logoutUser() {
  setAuth(null);
  localStorage.removeItem("role");
  localStorage.removeItem("email");
}

/* ------------------------------------------
 * WALLET / SETTINGS HELPERS (unchanged)
 * ------------------------------------------ */
export async function getDepositAddress() {
  try {
    const { data } = await api.get(`/api/wallet/deposit-address`, {
      params: { _ts: Date.now() },
    });

    if (!data?.address) throw new Error("No address returned");
    return data;
  } catch (err) {
    console.error("❌ getDepositAddress error:", {
      url: `${API_BASE}/api/wallet/deposit-address`,
      status: err?.response?.status,
      body: err?.response?.data,
      message: err?.message,
    });
    throw new Error(
      err?.response?.data?.error || "Failed to load deposit address"
    );
  }
}

export async function getCurrencies() {
  try {
    const { data } = await api.get(`/api/settings/exchange-rates/currencies`, {
      params: { _ts: Date.now() },
    });
    return data;
  } catch (err) {
    console.error("❌ getCurrencies error:", err?.response?.data || err.message);
    return { currencies: ["KES"] };
  }
}

/* ------------------------------------------
 * PREVIEW CALCULATOR (unchanged)
 * ------------------------------------------ */
export async function previewTransaction(btcAmount, currency) {
  if (!btcAmount || !currency) throw new Error("BTC amount and currency required");

  const btcToUsdRate = 117000;
  const fxRates = { KES: 129, UGX: 3800, TZS: 2600 };
  if (!fxRates[currency]) throw new Error("Unsupported currency");

  const usdValue = btcAmount * btcToUsdRate;

  const token = localStorage.getItem("token");
  if (!token && usdValue > GUEST_TX_LIMIT_USD) {
    throw new Error(`Guests cannot preview amounts above $${GUEST_TX_LIMIT_USD}`);
  }

  const feePercent = 2;
  const feeUsd = usdValue * (feePercent / 100);
  const netUsd = usdValue - feeUsd;
  const finalAmountLocal = netUsd * fxRates[currency];

  return { btcAmount, btcToUsdRate, usdValue, netUsd, finalAmountLocal, currency };
}

/* ------------------------------------------
 * RESTORE AUTH ON APP LOAD
 * ------------------------------------------ */
(function restoreAuthOnLoad() {
  const token = localStorage.getItem("token");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const decoded = jwtDecode(token);
      if (decoded.role) localStorage.setItem("role", decoded.role);
      if (decoded.email) localStorage.setItem("email", decoded.email);
    } catch {
      console.warn("⚠️ Invalid/expired token, clearing storage");
      logoutUser();
    }
  }
})();

/* ------------------------------------------
 * ATTACH TOKEN ALWAYS
 * ------------------------------------------ */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ------------------------------------------
 * CURRENT USER
 * ------------------------------------------ */
export function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return {
      email: decoded.email || localStorage.getItem("email"),
      role: decoded.role || localStorage.getItem("role"),
      token,
    };
  } catch {
    return null;
  }
}

export default api;
