// src/components/KahawaPayHero.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { fetchRates } from '../utils/fetchRates.js';

const CACHE_KEY = 'kahawapay_rates_ui_v1';
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
  const [loading, setLoading] = useState(!Boolean(data));
  const [error, setError] = useState(null);

  const load = useCallback(async (opts = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchRates(opts);
      setData(result);
      writeCache(result);
    } catch (err) {
      setError(err?.message || String(err) || 'Failed to load rates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!data) load();
    const id = setInterval(() => load(), 60 * 1000);
    return () => clearInterval(id);
  }, [data, load]);

  const fmt = (v) => {
    if (v === null || v === undefined) return '—';
    if (typeof v === 'number') return v.toLocaleString();
    const n = Number(String(v).replace(/,/g, ''));
    return Number.isFinite(n) ? n.toLocaleString() : String(v);
  };

  const ratesObj = (data && (data.rates || data)) || {};
  const lastUpdated = data?.lastUpdated ?? data?.fetchedAt ?? null;

  return (
    <section className="w-full bg-gradient-to-r from-sky-50 to-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 rounded-2xl bg-white p-2 shadow">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="6" fill="#0ea5e9" />
              <text x="50%" y="53%" dominantBaseline="middle" textAnchor="middle" fontWeight="700" fontSize="12" fill="white">KP</text>
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight">Our Competitive Market Prices</h1>
            <p className="text-sm text-slate-500">Live indicative rates — updated periodically</p>
          </div>
        </div>

        <div className="text-sm text-slate-500 text-right">
          {!loading && !error && lastUpdated ? <div>Updated: {new Date(lastUpdated).toLocaleString()}</div> : null}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-4">
        <div className="w-full bg-white rounded-2xl p-3 shadow-sm mt-3">
          {loading ? (
            <div className="flex items-center gap-3 py-6 justify-center">
              <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="4" stroke="currentColor" strokeOpacity="0.2" fill="none" />
                <path d="M4 12a8 8 0 018-8" strokeWidth="4" stroke="currentColor" strokeLinecap="round" fill="none" />
              </svg>
              <span className="text-sm text-slate-600">Loading rates…</span>
            </div>
          ) : error ? (
            <div className="text-sm text-red-600 py-3">
              Failed to load rates ({error}). Check backend or try again later.
            </div>
          ) : !ratesObj || (Object.keys(ratesObj).length === 0) ? (
            <div className="text-sm text-slate-600 py-3">No rates available</div>
          ) : (
            <div>
              <div className="flex flex-wrap gap-4 items-start mb-4">
                <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-100 shadow-sm min-w-[150px]">
                  <div className="text-xs text-gray-600">BTC / USD</div>
                  <div className="text-lg font-medium text-gray-900">{fmt(ratesObj.btc_usd ?? ratesObj.bitcoinUsd ?? ratesObj.bitcoin)}</div>
                </div>

                <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-100 shadow-sm min-w-[150px]">
                  <div className="text-xs text-gray-600">KES / USD</div>
                  <div className="text-lg font-medium text-gray-900">{fmt(ratesObj.kes_per_usd ?? ratesObj.kesUsd ?? ratesObj['US Dollar'] ?? ratesObj['KES'])}</div>
                </div>

                <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-100 shadow-sm min-w-[150px]">
                  <div className="text-xs text-gray-600">UGX / USD</div>
                  <div className="text-lg font-medium text-gray-900">{fmt(ratesObj.ugx_per_usd ?? ratesObj.ugxUsd ?? ratesObj['Uganda Shilling'])}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-sm">
                {Object.entries(ratesObj)
                  .filter(([k]) => ![
                    'btc_usd','bitcoinUsd','bitcoin',
                    'kes_per_usd','kesUsd','US Dollar','KES',
                    'ugx_per_usd','ugxUsd','Uganda Shilling'
                  ].includes(k))
                  .slice(0, 40)
                  .map(([currency, value]) => (
                    <div key={currency} className="flex justify-between px-3 py-2 bg-white border rounded">
                      <span className="text-gray-700">{currency}</span>
                      <span className="font-medium text-gray-900">{fmt(value)}</span>
                    </div>
                  ))}
              </div>

              <div className="text-xs text-slate-500 mt-3">
                Source: {ratesObj.source ?? 'unknown'} • Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : '—'}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
