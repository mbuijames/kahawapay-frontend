// src/api.js
import axios from "axios";
import { jwtDecode } from "jwt-decode";

/* ------------------------------------------
 * BASE URL (env-driven, safe in prod)
 * ------------------------------------------ */
const isProd = import.meta.env.MODE === "production";
const envBase = import.meta.env.VITE_API_BASE;

// In production, fail fast if API base isn't set
if (isProd && !envBase) {
  throw new Error("VITE_API_BASE is not set in production build");
}

// In dev you may fall back to local; in prod we already required envBase
export const API_BASE = (envBase || "http://localhost:5000").replace(/\/+$/, "");

/* ------------------------------------------
 * AXIOS CLIENT
 * ------------------------------------------ */
export const api = axios.create({
  baseURL: API_BASE,                          // do NOT include "/api" here
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
  // withCredentials: true, // enable only if you use cookie auth
});

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
    const { data } = await api.post(`/api/auth/login`, { email, password });

    // Optional 2FA path
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
    const { data } = await api.post(`/api/auth/register`, { email, password });
    return data; // e.g., { token, role, email } OR { id, email, role }
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
      // _ts added by interceptor as well; keeping here is harmless
      params: { _ts: Date.now() },
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
    throw new Error(err?.response?.data?.error || "Failed to load deposit address");
  }
}

export async function getCurrencies() {
  try {
    // Adjust if your backend exposes a different route
    const { data } = await api.get(`/api/settings/exchange-rates/currencies`, {
      params: { _ts: Date.now() },
    });
    // Expecting { currencies: [...] }
    return data;
  } catch (err) {
    console.error("❌ getCurrencies error:", err?.response?.data || err.message);
    // Safe fallback
    return { currencies: ["KES"] };
  }
}

/* ------------------------------------------
 * PREVIEW CALCULATOR (frontend-only helper)
 * ------------------------------------------ */
export async function previewTransaction(btcAmount, currency) {
  if (!btcAmount || !currency) throw new Error("BTC amount and currency required");

  // These are placeholders; your backend should compute the real values
  const btcToUsdRate = 117000; // demo rate
  const fxRates = { KES: 129, UGX: 3800, TZS: 2600 };
  if (!fxRates[currency]) throw new Error("Unsupported currency");

  const usdValue = btcAmount * btcToUsdRate;

  // Guest limit example
  const token = localStorage.getItem("token");
  if (!token && usdValue > 10000) {
    throw new Error("Guests cannot preview amounts above $10,000");
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
 * INTERCEPTORS: attach token + cache-buster
 * ------------------------------------------ */
api.interceptors.request.use((config) => {
  // Bearer token (in case token changed after init)
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Cache-buster (_ts) to avoid stale caches/CDNs
  const p = new URLSearchParams(config.params || {});
  if (!p.has("_ts")) p.set("_ts", Date.now());
  config.params = p;

  return config;
});

/* ------------------------------------------
 * CURRENT USER HELPER
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
