// File: src/components/KahawaPayHero.jsx
// Default export React component. Uses Tailwind classes.
// Expects an environment variable VITE_RATES_API_URL (e.g. https://kahawapay-backend.onrender.com)


import React, { useEffect, useState } from 'react';
import { fetchRates } from '../utils/fetchRates';


export default function KahawaPayHero() {
const [rates, setRates] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [lastUpdated, setLastUpdated] = useState(null);


useEffect(() => {
let mounted = true;


async function load() {
setLoading(true);
setError(null);
try {
const result = await fetchRates();
if (!mounted) return;
setRates(result.rates || result);
setLastUpdated(result.lastUpdated || result.fetched_at || null);
} catch (err) {
if (!mounted) return;
console.error('fetchRates error', err);
setError(err.message || 'Failed to load rates');
setRates(null);
} finally {
if (!mounted) return;
setLoading(false);
}
}


load();


// refresh every 60 seconds in background while mounted
const id = setInterval(load, 60000);
return () => {
mounted = false;
clearInterval(id);
};
}, []);


return (
<section className="w-full bg-gradient-to-r from-sky-50 to-white border-b shadow-sm">
<div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
<div className="flex items-center gap-3">
<div className="flex-shrink-0 rounded-2xl bg-white p-2 shadow">
<svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="24" height="24" rx="6" fill="#0ea5e9" />
<text x="50%" y="53%" dominantBaseline="middle" textAnchor="middle" fontWeight="700" fontSize="12" fill="white">KP</text>
</svg>
</div>
<div>
<h1 className="text-lg font-semibold leading-tight">KahawaPay — Live rates</h1>
<p className="text-sm text-slate-500">BTC · KES · UGX · TZS · INR · Central Bank source</p>
</div>
</div>


<div className="flex-1">
<div className="w-full bg-white rounded-2xl p-3 shadow-sm">
{loading ? (
<div className="flex items-center justify-center py-6">
<svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
<circle cx="12" cy="12" r="10" strokeWidth="4" stroke="currentColor" strokeOpacity="0.2" fill="none"></circle>
<path d="M4 12a8 8 0 018-8" strokeWidth="4" stroke="currentColor" strokeLinecap="round" fill="none"></path>
</svg>
<span className="text-sm text-slate-600">Loading rates…</span>
</div>
) : error ? (
<div className="text-sm text-red-600 py-3">{error}</div>
) : !rates ? (
<div className="text-sm text-slate-600 py-3">No rates available</div>
) : (
}
