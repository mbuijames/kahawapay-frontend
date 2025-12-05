// src/components/KahawaPayHero.jsx
import React, { useEffect, useState, useCallback } from "react";
import { fetchRates } from "../utils/fetchRates.js";

const CACHE_KEY = "kahawapay_rates_ui_v2";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/* ------------------ Cache Helpers ------------------ */
function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - (parsed.ts || 0) > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {}
}

/* ------------------ UI Component ------------------ */
export default function KahawaPayHero() {
  const [data, setData] = useState(() => readCache());
  const [loading, setLoading] = useState(!Boolean(data));
  const [error, setError] = useState(null);

  /* Load Rates */
  const loadRates = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchRates();
      setData(result);
      writeCache(result);
    } catch (err) {
      setError(err?.message || "Failed to load rates");
    } finally {
      setLoading(false);
    }
  }, []);

  /* Initial load + auto-refresh */
  useEffect(() => {
    if (!data) loadRates();
    const id = setInterval(loadRates, 60000);
    return () => clearInterval(id);
  }, [data, loadRates]);

  const fmt = (v) => {
    if (v === null || v === undefined) return "—";
    const num = Number(String(v).replace(/,/g, ""));
    return Number.isFinite(num) ? num.toLocaleString() : v;
  };

  const rows = Array.isArray(data?.rates) ? data.rates : Array.isArray(data) ? data : [];
  const filteredRows = rows.filter(
    (r) => (r.target_currency || "").toUpperCase() !== "FEE"
  );

  const lastUpdated = data?.lastUpdated ?? null;

  return (
    <section className="w-full bg-gradient-to-r from-sky-50 to-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 rounded-2xl p-2 shadow bg-kahawa/20">
              <svg width="40" height="40" viewBox="0 0 24 24">
                <rect width="24" height="24" rx="6" fill="#b05625" /> {/* kahawa color */}
                <text
                  x="50%"
                  y="53%"
                  textAnchor="middle"
                  fontWeight="700"
                  fontSize="12"
                  fill="white"
                >
                  KP
                </text>
              </svg>
            </div>

            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                Our Competitive Market Prices
              </h1>
              <p className="text-sm text-slate-500">
                Live indicative rates — updated automatically
              </p>

              {/* SINGLE Last updated line */}
              <div className="text-xs text-slate-500 mt-1">
                Source: {data?.source ?? "unknown"}
                {lastUpdated && ` • Updated: ${new Date(lastUpdated).toLocaleString()}`}
              </div>
            </div>
          </div>
        </div>

        {/* RATES GRID */}
        <div className="mt-6">
          {loading && (
            <div className="text-sm text-slate-500">Loading rates…</div>
          )}

          {error && (
            <div className="text-sm text-red-600">Error: {error}</div>
          )}

          {!loading && !error && filteredRows.length === 0 && (
            <div className="text-sm text-slate-500">No rates available</div>
          )}

          {!loading && !error && filteredRows.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredRows.map((r) => {
                const key = `${r.base_currency || r.base || "BASE"}_${r.target_currency || r.target || "TGT"}`;
                return (
                  <div
                    key={key}
                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition flex flex-col justify-between"
                  >
                    <div className="text-sm font-medium text-slate-800">
                      {(r.base_currency || r.base || "").toUpperCase()} → {(r.target_currency || r.target || "").toUpperCase()}
                    </div>
                    <div className="text-lg font-semibold text-kahawa mt-2">
                      {fmt(r.rate ?? r.value ?? r.price)}
                    </div>
                    {r.name && (
                      <div className="text-xs text-slate-400 mt-1">{r.name}</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
