// src/api.js
import axios from "axios";
import { jwtDecode } from "jwt-decode";

/**
 * CONFIG
 * - Set VITE_API_BASE to your backend origin only, e.g. "http://localhost:5000"
 *   (do NOT include /api here)
 * - All endpoints below include "/api/..." so they work consistently.
 */
const API_BASE = import.meta.env?.VITE_API_BASE || "http://localhost:5000";
export const api = axios.create({ baseURL: API_BASE });

// 👇 Guest USD limit from env (frontend-visible)
export const GUEST_TX_LIMIT_USD = Number(import.meta.env?.VITE_GUEST_TX_LIMIT_USD ?? 100);

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
 * AUTH: LOGIN / REGISTER
 * ------------------------------------------ */
export async function loginUser(email, password) {
  try {
    const { data } = await api.post(`/api/auth/login`, { email, password }, {
      headers: { "Content-Type": "application/json" },
    });

    // 2FA path support (if your backend returns it)
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
      err?.message ||
      "Login failed. Please try again.";
    console.error("🔥 loginUser error:", msg, err?.response?.data || "");
    throw new Error(msg);
  }
}

export async function registerUser(email, password) {
  try {
    const { data } = await api.post(`/api/auth/register`, { email, password }, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  } catch (err) {
    const msg =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      "Registration failed. Please try again.";
    console.error("🔥 registerUser error:", msg, err?.response?.data || "");
    throw new Error(msg);
  }
}

/* ------------------------------------------
 * WALLET / SETTINGS HELPERS
 * ------------------------------------------ */
export async function getDepositAddress() {
  try {
    const { data } = await api.get(`/api/wallet/deposit-address`, {
      params: { _ts: Date.now() }, // cache-bust
    });
    if (!data?.address) throw new Error("No address returned");
    return data; // { address: "..." }
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

/**
 * Preview calculator (frontend fallback mock).
 * Your app often computes on the backend; keep this for quick previews if needed.
 */
export async function previewTransaction(btcAmount, currency) {
  if (!btcAmount || !currency) throw new Error("BTC amount and currency required");

  const btcToUsdRate = 117000; // demo rate
  const fxRates = { KES: 129, UGX: 3800, TZS: 2600 };
  if (!fxRates[currency]) throw new Error("Unsupported currency");

  const usdValue = btcAmount * btcToUsdRate;

  // Guest limit (UX-only; backend still enforces)
  const token = localStorage.getItem("token");
  if (!token && usdValue > GUEST_TX_LIMIT_USD) {
    throw new Error(`Guests cannot preview amounts above $${GUEST_TX_LIMIT_USD.toLocaleString()}`);
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
 * ALWAYS ATTACH TOKEN
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
