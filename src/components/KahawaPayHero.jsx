// src/components/KahawaPayHero.jsx
// Default export React component. Uses Tailwind classes.
// Expects an environment variable VITE_RATES_API_URL (e.g. https://kahawapay-backend.onrender.com)

import React, { useEffect, useState } from 'react';
import { fetchRates } from '../utils/fetchRates';

const DEFAULT_API = (import.meta.env.VITE_RATES_API_URL || "https://kahawapay-backend.onrender.com").replace(/\/$/, "");
const ENDPOINT = `${DEFAULT_API}/api/rates`;

// caching helpers (plain JS)
const CACHE_KEY = "kahawapay_rates_ui_v1";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

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

export default function KahawaPayHero() {
  const [data, setData] = useState(() => readCache());
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (data) return; // cached
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(ENDPOINT, { mode: "cors" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("text/html")) throw new Error("unexpected HTML response (wrong host)");
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        const normalized = {
          rates: json?.rates || json?.data || {},
          fetchedAt: json?.fetchedAt || json?.lastUpdated || json?.fetched_at || new Date().toISOString(),
          source: json?.source || null,
        };
        setData(normalized);
        writeCache(normalized);
      })
      .catch((err) => {
        console.error("KahawaPayHero: failed to load rates:", err);
        if (!cancelled) setError(err.message || "Failed to load rates");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fmt = (v) => {
    if (v === null || v === undefined) return "N/A";
    if (typeof v === "number") return v.toLocaleString();
    const n = Number(String(v).replace(/,/g, ""));
    return Number.isFinite(n) ? n.toLocaleString() : String(v);
  };

  const mainCurrencies = [
    { key: "US Dollar", label: "KES / USD", pick: (rates) => rates["US Dollar"] ?? rates["USD"] ?? rates["US Dollar (KES)"] ?? null },
    { key: "Uganda Shilling", label: "UGX / USD", pick: (rates) => rates["Uganda Shilling"] ?? null },
    { key: "Tanzanian Shilling", label: "TZS / USD", pick: (rates) => rates["Tanzanian Shilling"] ?? rates["Tanzania Shilling"] ?? null },
    { key: "Indian Rupee", label: "INR / USD", pick: (rates) => rates["Indian Rupee"] ?? null },
  ];

  const ratesObj = (data && data.rates) || {};
  const mainKeys = new Set(["US Dollar", "Uganda Shilling", "Tanzanian Shilling", "Tanzania Shilling", "Indian Rupee"]);
  const otherEntries = Object.entries(ratesObj).filter(([k]) => !mainKeys.has(k)).slice(0, 40);

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="text-lg font-semibold text-gray-900">Our Competitive Market Prices</div>
            <div className="text-xs text-gray-500 mt-1">Live indicative rates — updated periodically</div>
          </div>

          <div className="text-right text-xs text-gray-500">
            {!loading && !error && data?.fetchedAt ? (
              <div>Updated: {new Date(data.fetchedAt).toLocaleString()}</div>
            ) : null}
          </div>
        </div>

        <div className="mt-3">
          {loading && <div className="text-sm text-gray-600">Loading rates…</div>}

          {error && (
            <div className="text-sm text-red-600">
              Failed to load rates ({error}). Check backend or try again later.
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="flex flex-wrap gap-4 items-center mb-3">
                {mainCurrencies.map((mc) => {
                  const v = mc.pick(ratesObj);
                  return (
                    <div key={mc.label} className="px-3 py-2 bg-gray-50 rounded-md border border-gray-100 shadow-sm min-w-[150px]">
                      <div className="text-xs text-gray-600">{mc.label}</div>
                      <div className="text-lg font-medium text-gray-900">{fmt(v)}</div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-sm">
                {otherEntries.map(([currency, value]) => (
                  <div key={currency} className="flex justify-between px-3 py-2 bg-white border rounded">
                    <span className="text-gray-700">{currency}</span>
                    <span className="font-medium text-gray-900">{fmt(value)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
