import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api"; // <-- use centralized client
import TransactionsTable from "./TransactionsTable";
import ExchangeRatesTable from "./ExchangeRatesTable";

export default function AdminPanel() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

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

    const updated = r.updated_at ?? r.updatedAt ?? null;

    return {
      target_currency: target,
      rate: value,
      updated_at: updated,
      target,
      value,
    };
  };

  // Deduplicate: keep freshest row per currency
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
    return Array.from(byTarget.values())
      .map(({ _ts, ...r }) => r)
      .sort((a, b) => a.target_currency.localeCompare(b.target_currency));
  };

  // ---------- Loaders ----------
  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/transactions/all");
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
      // Backend GET should be public + no-cache headers
      const res = await api.get("/api/settings/exchange-rates");
      const raw = Array.isArray(res.data) ? res.data : [];
      const normalized = raw.map(normalizeRate);
      setRates(uniqueNewestByTarget(normalized));
    } catch (e) {
      console.error("❌ loadRates:", e?.response?.status, e?.response?.data || e.message);
    }
  };

  // ---------- Mutations ----------
  const markPaid = async (id) => {
    try {
      await api.put(`/api/transactions/${id}/mark-paid`);
      await loadTransactions();
    } catch (e) {
      console.error("❌ markPaid:", e);
      alert(e?.response?.data?.error || "Error marking transaction as paid");
    }
  };

  const archiveTx = async (id) => {
    try {
      await api.put(`/api/transactions/${id}/archive`);
      await loadTransactions();
    } catch (e) {
      console.error("❌ archiveTx:", e);
      alert(e?.response?.data?.error || "Error archiving transaction");
    }
  };

  const saveRate = async ({ target_currency, rate }) => {
    if (saving) return;
    setSaving(true);
    try {
      const cur = String(target_currency || "").toUpperCase().trim();
      const cleaned = Number(String(rate ?? "").replace(/[,\s_]/g, ""));

      if (!/^[A-Z0-9:_-]{3,32}$/.test(cur) || !Number.isFinite(cleaned) || cleaned <= 0) {
        alert("Enter a valid currency (e.g., KES / BTCUSD) and a positive rate.");
        return;
      }

      const payload = { target_currency: cur, rate: cleaned };

      // Prefer v3; fallback to legacy POST if v3 isn’t mounted
      let res;
      try {
        res = await api.post("/api/settings/exchange-rates/v3", payload);
      } catch (_e) {
        res = await api.post("/api/settings/exchange-rates", payload);
      }

      const echoed = res?.data ? normalizeRate(res.data) : {
        target_currency: cur, rate: cleaned, updated_at: new Date().toISOString(), target: cur, value: cleaned
      };

      setRates((prev) => uniqueNewestByTarget([echoed, ...prev]));
      await loadRates(); // confirm from server
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

  const ratesVersion = useMemo(
    () => rates.map(r => `${r.target_currency}:${r.rate}:${r.updated_at ?? ""}`).join("|"),
    [rates]
  );

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

      <ExchangeRatesTable key={ratesVersion} rates={rates} onSave={saveRate} saving={saving} />
    </div>
  );
}
