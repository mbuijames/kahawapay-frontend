// File: src/components/KahawaPayHero.jsx
// Default export React component. Uses Tailwind classes.
// Expects an environment variable VITE_RATES_API_URL (e.g. https://kahawapay-backend.onrender.com)


import React, { useEffect, useState } from 'react';
import { fetchRates } from '../utils/fetchRates.js';


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
