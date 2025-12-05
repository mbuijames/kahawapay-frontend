// src/utils/fetchRates.js (frontend)
const apiUrl = import.meta.env.VITE_RATES_API_URL;

export async function fetchRates() {
  try {
    const res = await fetch(apiUrl); 
    if (!res.ok) throw new Error(`Rates API ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Failed to load rates", err);
    return [];
  }
}


