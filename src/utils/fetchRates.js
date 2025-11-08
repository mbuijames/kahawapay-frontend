// src/utils/fetchRates.js  (frontend — browser safe)
// Used by KahawaPayHero.jsx (client). This must NOT include cheerio/node-cache.

export async function fetchRates({ baseUrl } = {}) {
  const API_BASE = baseUrl || (import.meta.env.VITE_RATES_API_URL || '');
  const url = API_BASE ? `${API_BASE.replace(/\/$/, '')}/api/rates` : '/api/rates';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`Rates API ${res.status} ${res.statusText}`);
    return await res.json();
  } catch (err) {
    clearTimeout(timeout);
    const e = new Error(err.name === 'AbortError' ? 'Rates request timed out' : (err.message || String(err)));
    throw e;
  }
}
