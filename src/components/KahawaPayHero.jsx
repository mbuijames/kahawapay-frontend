// src/components/KahawaPayHero.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { fetchRates } from '../utils/fetchRates.js';

const CACHE_KEY = 'kahawapay_rates_ui_v2';
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
  const filteredRows = rows.filter(r => (r.target_currency || "").toUpperCase() !== "FEE");

  const lastUpdated = data?.lastUpdated ?? null;

  return (
    <section className="w-full bg-gradient-to-r from-sky-50 to-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        {/* HEADER */}
<div className="flex items-center gap-3">
  <div className="flex-shrink-0 rounded-2xl bg-white p-2 shadow">
    <svg width="40" height="40" viewBox="0 0 24 24">
      <rect width="24" height="24" rx="6" fill="#0ea5e9" />
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
    <h1 className="text-lg font-semibold">Our Competitive Market Prices</h1>
    <p className="text-sm text-slate-500">
      Live indicative rates — updated automatically
    </p>
  </div>
</div>

              <div className="text-xs text-slate-500 mt-4">
                Source: {data?.source ?? "unknown"}
                {lastUpdated && ` • Updated: ${new Date(lastUpdated).toLocaleString()}`}
              </div>
            </>
          )}

        </div>
      </div>
    </section>
  );
}
