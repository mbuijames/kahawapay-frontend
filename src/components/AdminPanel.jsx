import React, { useEffect, useState } from "react";
import axios from "axios";
import TransactionsTable from "./TransactionsTable";
import ExchangeRatesTable from "./ExchangeRatesTable";

const API_BASE = import.meta.env?.VITE_API_BASE || ""; // e.g. http://localhost:5000

export default function AdminPanel() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Build a fresh config each call so token is current
  const makeCfg = () => {
    const token = localStorage.getItem("token") || "";
    return {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
      },
      params: { _ts: Date.now() }, // cache-bust
    };
  };

  const normalizeTx = (r) => ({
    id: r.id,
    email: r.email ?? r.payer_email ?? r.sender_email ?? "",
    msisdn: r.msisdn ?? r.recipient_msisdn ?? "",
    amount_recipient: Number(r.amount_recipient ?? r.recipient_amount ?? 0),
    amount_usd: r.amount_usd ?? null,
    currency: r.currency ?? "KES",
    status: (r.status || "pending").toLowerCase(),
    created_at: r.created_at,
  });

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

  
const loadRates = async () => {
  try {
    const url = `${API_BASE}/api/settings/exchange-rates`;
    const res = await axios.get(url, makeCfg());
    console.log("rates raw:", res.data);                 // 👈 see exact payload
    const data = res.data;
    // Accept either an array or { rates: [...] }
    const list =
      Array.isArray(data) ? data :
      (Array.isArray(data?.rates) ? data.rates : []);
    setRates(list);
  } catch (e) {
    console.error("❌ loadRates:", e?.response?.status, e?.response?.data || e.message);
    // Optional: show a small error somewhere, but don't crash
    // setRates([]); // keep as [] if it fails
  }
};

  // ✅ This is what ExchangeRatesTable calls
 // inside AdminPanel.jsx
const saveRate = async ({ target_currency, rate }) => {
  const url = `${API_BASE}/api/settings/exchange-rates`;
  const payloads = [
    // 1) snake_case (what we expect)
    { target_currency: String(target_currency || "").toUpperCase().trim(), rate: Number(rate) },
    // 2) camelCase
    { targetCurrency: String(target_currency || "").toUpperCase().trim(), rate: Number(rate) },
    // 3) currency + rate
    { currency: String(target_currency || "").toUpperCase().trim(), rate: Number(rate) },
    // 4) target + value
    { target: String(target_currency || "").toUpperCase().trim(), value: Number(rate) },
  ];

  // basic client-side validation once
  const cur = payloads[0].target_currency;
  const num = payloads[0].rate;
  if (!/^[A-Z]{3,10}$/.test(cur) || !Number.isFinite(num) || num <= 0) {
    alert("Enter a valid currency (e.g., KES) and a positive numeric rate.");
    return;
  }

  // Try each shape until one succeeds
  let lastErr = null;
  for (const p of payloads) {
    try {
      console.log("➡️ POST /api/settings/exchange-rates payload:", p);
      await axios.post(url, p, makeCfg());
      await loadRates();
      return; // success, stop trying
    } catch (e) {
      lastErr = e;
      // log full server response for visibility
      console.error("❌ saveRate attempt failed:", {
        sent: p,
        status: e?.response?.status,
        data: e?.response?.data,
      });
      // if server responded 4xx/5xx, try next shape
    }
  }

  // If all attempts failed, surface the server's message
  const serverMsg =
    lastErr?.response?.data?.error ||
    lastErr?.response?.data?.message ||
    lastErr?.message ||
    "Failed to save rate";
  alert(serverMsg);
};

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
          onClick={() => { loadTransactions(); loadRates(); }}
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

      <ExchangeRatesTable rates={rates} onSave={saveRate} />
    </div>
  );
}
