// src/components/KahawaPayHero.jsx
import React, { useEffect, useState } from "react";

export default function KahawaPayHero() {
  const [btc, setBtc] = useState(null);

  // Fetch live BTC price from Binance
  const fetchBTC = async () => {
    try {
      const res = await fetch(
        "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
      );
      const data = await res.json();
      setBtc(parseFloat(data.price).toLocaleString());
    } catch (err) {
      console.error("BTC fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchBTC();
    const timer = setInterval(fetchBTC, 5000); // refresh every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full flex justify-center py-10 bg-white">
      <button
        className="
          px-10 py-5 
          text-2xl font-bold 
          rounded-2xl shadow-lg 
          bg-kahawa text-white
          hover:shadow-xl transition
        "
      >
        BTC / USD: {btc ? btc : "Loading…"}
      </button>
    </div>
  );
}
