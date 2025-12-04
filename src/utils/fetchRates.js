// src/utils/fetchRates.js (frontend)
export async function fetchRates() {
  const apiUrl = import.meta.env.VITE_RATES_API_URL;

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`Failed to load rates: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Error fetching rates:", err);
    return null;
  }
}

