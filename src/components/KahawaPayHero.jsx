// src/components/KahawaPayHero.jsx
import React, { useEffect, useState } from "react";

/**
 * KahawaPayHero.jsx
 * Minimal top banner only — shows BTC + selected central-bank rates.
 * Designed to replace your previous top-banner component so it does NOT duplicate the main hero body.
 *
 * Backend: expects an endpoint at `${API_BASE}/api/rates` returning the JSON produced by the backend proxy.
 */

const res = await fetch("https://kahawapay-backend.onrender.com/api/rates");
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
  } catch (e) {
    return null;
  }
}
function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch (e) {}
}

export default function KahawaPayHero() {
  const [rates, setRates] = useState(() => readCache());
  const [loading, setLoading] = useState(!rates);
  const [error, setError] = useState(null);

  const apiBase = (import.meta.env.VITE_RATES_API_URL || DEFAULT_API).replace(/\/$/, "");
  const endpoint = `${apiBase}/api/rates`;

  useEffect(() => {
    if (rates) return; // we have fresh UI cache
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
        const normalized = {
          btc_usd: json?.btc_usd ?? json?.bitcoinUsd ?? json?.bitcoinUsd ?? null,
          kes_per_usd: json?.kes_per_usd ?? json?.kesUsd ?? json?.kes ?? null,
          ugx_per_usd: json?.ugx_per_usd ?? json?.ugxUsd ?? json?.ugx ?? null,
          tzs_per_usd: json?.tzs_per_usd ?? json?.tzsUsd ?? json?.tzs ?? null,
          inr_per_usd: json?.inr_per_usd ?? json?.inrUsd ?? json?.inr ?? null,
          fetched_at: json?.fetched_at ?? json?.lastUpdated ?? new Date().toISOString(),
        };
        setRates(normalized);
        writeCache(normalized);
      })
      .catch((err) => {
        console.error("Failed to load rates:", err);
        if (!cancelled) setError(err.message || "failed");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  const fmt = (v) => {
    if (v === null || v === undefined) return "N/A";
    if (typeof v === "number") return v.toLocaleString();
    const n = Number(String(v).replace(/,/g, ""));
    return Number.isFinite(n) ? n.toLocaleString() : String(v);
  };

  return (
    <div className="bg-transparent">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="border-4 border-black h-16 rounded-sm bg-white flex items-center p-4">
          <div className="w-full flex items-center justify-between">
            <div className="text-sm text-gray-700">
              <div>
                <strong>Bitcoin</strong>{" "}
                {loading && !rates ? (
                  <span> = Loading…</span>
                ) : (
                  <span> = ${fmt(rates?.btc_usd)}</span>
                )}
                <span className="ml-2 text-xs text-gray-500">(source: backend)</span>
              </div>

              <div className="mt-1 text-xs text-gray-700">
                <strong>KES / USD</strong> = {fmt(rates?.kes_per_usd)} <span className="text-xs text-gray-500">(CBK)</span>
                {" — "}
                <strong>UGX / USD</strong> = {fmt(rates?.ugx_per_usd)} <span className="text-xs text-gray-500">(BoU)</span>
                {" — "}
                <strong>TZS / USD</strong> = {fmt(rates?.tzs_per_usd)} <span className="text-xs text-gray-500">(BoT)</span>
                {" — "}
                <strong>INR / USD</strong> = {fmt(rates?.inr_per_usd)} <span className="text-xs text-gray-500">(RBI)</span>
              </div>
            </div>

            <div className="text-right text-xs text-gray-500">
              <div>
                Updated:{" "}
                {rates?.fetched_at ? new Date(rates.fetched_at).toLocaleString() : "-"}
              </div>
              <div className="mt-1">
                {error ? <span className="text-red-600">Error fetching rates</span> : <span>Official central banks & CoinGecko</span>}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-2 text-sm text-red-600">
            Failed to fetch rates from backend ({error}). Check backend server or console.
          </div>
        )}
      </div>
    </div>
  );
}
