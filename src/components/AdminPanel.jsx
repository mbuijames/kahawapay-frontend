import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import TransactionsTable from "./TransactionsTable";
import ExchangeRatesTable from "./ExchangeRatesTable";

// Ensure requests hit your backend even without a .env during dev
const API_BASE = import.meta.env?.VITE_API_BASE || "http://localhost:5000";

export default function AdminPanel() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Always include Authorization if present; add cache-buster param
  const makeCfg = () => {
    const token = localStorage.getItem("token") || "";
    return {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
      },
      params: { _ts: Date.now() },
      withCredentials: false, // set true only if you rely on cookie auth
    };
  };

  // ---------- Normalizers ----------
  const normalizeTx = (r) => ({
    id: r.id,
    email: r.email ?? r.payer_email ?? r.sender_email ?? r.user_email ?? "",
    msisdn: r.msisdn ?? r.recipient_msisdn ?? "",
    amount_recipient: Number(r.amount_recipient ?? r.recipient_amount ?? r.amount_kes ?? 0),
    amount_usd: r.amount_usd ?? null,
    currency: (r.currency ?? "KES").toString().toUpperCase(),
    status: (r.status || "pending").toLowerCase(),
    created_at: r.created_at ?? r.createdAt ?? null,
  });

  const normalizeRate = (r) => {
    const target =
      (r.target_currency ?? r.target ?? r.currency ?? r.pair ?? r.symbol ?? r.code ?? "")
        .toString()
        .trim()
        .toUpperCase();

    const rawNum = r.rate ?? r.value ?? r.price ?? r.amount;
    const num = rawNum == null ? NaN : Number(String(rawNum).replace(/[,\s_]/g, ""));
    const value = Number.isFinite(num) ? num : null;

    // normalize updated_at into an ISO string; if missing, use null
    const updated =
      r.updated_at ??
      r.updatedAt ??
      (typeof r.updated_at === "string" ? r.updated_at : null);

    return {
      target_currency: target,
      rate: value,
      updated_at: updated,

      // legacy mirrors
      target,
      value,
    };
  };

  // Deduplicate: keep freshest row per currency (by updated_at desc)
  const uniqueNewestByTarget = (list) => {
    const byTarget = new Map();
    for (const row of list) {
      const key = row.target_currency;
      const ts = row.updated_at ? Date.parse(row.updated_at) : 0;
      const existing = byTarget.get(key);
      if (!existing || ts > (existing._ts || 0)) {
        byTarget.set(key, { ...row, _ts: ts });
      }
    }
    // return sorted by target asc
    return Array.from(byTarget.values())
      .map(({ _ts, ...r }) => r)
      .sort((a, b) => a.target_currency.localeCompare(b.target_currency));
  };

  // ---------- Loaders ----------
  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError("");
      const url = `${API_BASE}/api/transactions/all`;
      const res = await axios.get(url, makeCfg());
      const data = Array.isArray(res.data) ? res.data : [];
      setTransactions(data.map(normalizeTx));
    } catch (e) {
      console.error("❌ loadTransactions:", e);
      setError("Failed to load transactions");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const loadRates = async () => {
    try {
      // single, public, normalized endpoint (backend GET must be public)
      const url = `${API_BASE}/api/settings/exchange-rates`;
      const res = await axios.get(url, makeCfg());

      const raw = Array.isArray(res.data) ? res.data : [];
      const normalized = raw.map(normalizeRate);

      // 🔒 dedupe by target, keep freshest updated_at
      const newest = uniqueNewestByTarget(normalized);
      setRates(newest);
    } catch (e) {
      console.error("❌ loadRates:", e?.response?.status, e?.response?.data || e.message);
      // keep previous rates if fetch fails
    }
  };

  // ---------- Mutations ----------
  const markPaid = async (id) => {
    try {
      const url = `${API_BASE}/api/transactions/${id}/mark-paid`;
      await axios.put(url, {}, makeCfg());
      await loadTransactions();
    } catch (e) {
      console.error("❌ markPaid:", e);
      alert(e?.response?.data?.error || "Error marking transaction as paid");
    }
  };

  const archiveTx = async (id) => {
    try {
      const url = `${API_BASE}/api/transactions/${id}/archive`;
      await axios.put(url, {}, makeCfg());
      await loadTransactions();
    } catch (e) {
      console.error("❌ archiveTx:", e);
      alert(e?.response?.data?.error || "Error archiving transaction");
    }
  };

  const sanitizeRate = (r) => String(r ?? "").replace(/[,\s_]/g, ""); // "107,000" -> "107000"

  const saveRate = async ({ target_currency, rate }) => {
    if (saving) return;
    setSaving(true);
    try {
      const cur = String(target_currency || "").toUpperCase().trim();
      const cleaned = sanitizeRate(rate);

      if (!/^[A-Z0-9:_-]{3,32}$/.test(cur) || !cleaned || Number(cleaned) <= 0) {
        alert("Enter a valid currency (e.g., KES / BTCUSD) and a positive rate.");
        return;
      }

      const payload = { target_currency: cur, rate: cleaned, target: cur, value: cleaned };

      // Prefer v3; fallback to legacy POST path if v3 isn’t mounted
      const urlPrimary = `${API_BASE}/api/settings/exchange-rates/v3`;
      const urlFallback = `${API_BASE}/api/settings/exchange-rates`;

      let res;
      try {
        res = await axios.post(urlPrimary, payload, makeCfg());
      } catch (_e) {
        res = await axios.post(urlFallback, payload, makeCfg());
      }

      // Merge the echo optimistically
      const echoed = res?.data ? normalizeRate(res.data) : { target_currency: cur, rate: Number(cleaned), updated_at: new Date().toISOString(), target: cur, value: Number(cleaned) };
      const merged = uniqueNewestByTarget([echoed, ...rates]);
      setRates(merged);

      // Also refresh from server to be 100% in sync
      await loadRates();
    } catch (e) {
      console.error("❌ saveRate failed:", {
        sent: { target_currency, rate },
        status: e?.response?.status,
        data: e?.response?.data,
      });
      const msg =
        e?.response?.data?.details?.join?.("; ") ||
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e.message ||
        "Failed to save rate";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  // a changing key to force rerender of ExchangeRatesTable when list truly changes
  const ratesVersion = useMemo(() => {
    return rates.map(r => `${r.target_currency}:${r.rate}:${r.updated_at ?? ""}`).join("|");
  }, [rates]);

  useEffect(() => {
    loadTransactions();
    loadRates();
    const id = setInterval(() => {
      loadTransactions();
      loadRates();
    }, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <button
          onClick={() => {
            loadTransactions();
            loadRates();
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          🔄 Refresh
        </button>
      </div>

      <TransactionsTable
        transactions={transactions}
        filter={filter}
        onFilterChange={setFilter}
        onMarkPaid={markPaid}
        onArchive={archiveTx}
        loading={loading}
        error={error}
      />

      {/* key forces a full rerender if BTCUSD row changes */}
      <ExchangeRatesTable key={ratesVersion} rates={rates} onSave={saveRate} saving={saving} />
    </div>
  );
}
