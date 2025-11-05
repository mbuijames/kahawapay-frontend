// src/components/KahawaPayHero.jsx
import React, { useEffect, useState } from "react";

const API_BASE = "https://kahawapay-backend.onrender.com";
const CACHE_KEY = "kahawapay_rates_ui_v3";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 min

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

export default function KahawaPayHero({ title = "Our Competitive Market Prices" }) {
  const [rates, setRates] = useState(() => readCache());
  const [loading, setLoading] = useState(!rates);
  const [error, setError] = useState(null);

  const endpoint = `${API_BASE}/api/rates`;

  useEffect(() => {
    if (rates) return; // already cached

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        setRates(json);
        writeCache(json);
      })
      .catch((err) => {
        console.error("Failed to load rates:", err);
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  return (
    <div className="bg-white shadow-md border-b border-gray-300">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl font-bold text-brown-800">{title}</h1>
          {rates?.fetchedAt && (
            <span className="text-xs text-gray-500">
              Updated: {new Date(rates.fetchedAt).toLocaleString()}
            </span>
          )}
        </div>

        {loading && <p className="text-gray-500 text-sm">Loading latest rates…</p>}
        {error && (
          <p className="text-red-600 text-sm">
            Failed to fetch rates ({error}). Please try again later.
          </p>
        )}

        {!loading && rates?.rates && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-2 text-sm">
            {Object.entries(rates.rates).map(([currency, value]) => (
              <div key={currency} className="flex justify-between">
                <span>{currency}</span>
                <span className="font-medium">{Number(value).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
