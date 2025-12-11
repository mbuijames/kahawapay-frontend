// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import KahawaPayHero from "../components/KahawaPayHero";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      
      {/* 🔥 Top Banner (Live Rates + Bitcoin) */}
      <KahawaPayHero />

      {/* ================= HERO SECTION ================= */}
      <div className="text-center py-16 px-6">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-10 max-w-6xl mx-auto">
          
          {/* TEXT SECTION */}
          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-kahawa-dark mb-6 leading-tight">
              Send Bitcoin Tips Instantly to Kenya  
            </h1>

            <p className="text-lg sm:text-xl text-gray-700 max-w-xl mx-auto mb-8">
              Buy your buddies back home a coffee using Bitcoin or crypto.  
              <br />
              <span className="font-semibold">
                Fast, simple and secure tipping for the diaspora community.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/deposit"
                className="px-6 py-3 bg-kahawa-dark text-white rounded-lg shadow hover:opacity-90 text-lg font-medium"
              >
                Send a Bitcoin Tip
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 bg-white border border-kahawa-dark text-kahawa-dark rounded-lg shadow hover:bg-gray-50 text-lg font-medium"
              >
                Create Account
              </Link>
            </div>
          </div>

          {/* IMAGE */}
          <div className="flex-1">
            <img
              src="/coffee-illustration.svg"
              alt="Send crypto tips illustration"
              className="w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </div>

      {/* ================= WHY KAHAWAPAY ================= */}
      <div className="mt-20 max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-kahawa-dark text-center">
          Why Use KahawaPay?
        </h2>

        <div className="grid gap-6 sm:grid-cols-3 text-gray-700">
          
          <div className="p-6 border rounded-lg bg-white shadow hover:shadow-lg transition">
            <h3 className="font-semibold mb-2 text-lg">☕ Simple</h3>
            <p>
              Send Bitcoin or crypto tips in a few clicks — no wallet complexity, no delays.
            </p>
          </div>

          <div className="p-6 border rounded-lg bg-white shadow hover:shadow-lg transition">
            <h3 className="font-semibold mb-2 text-lg">⚡ Fast</h3>
            <p>
              Recipients in Kenya receive instant value converted to their local currency.
            </p>
          </div>

          <div className="p-6 border rounded-lg bg-white shadow hover:shadow-lg transition">
            <h3 className="font-semibold mb-2 text-lg">🔒 Secure</h3>
            <p>
              Powered by blockchain transparency and reliable crypto infrastructure.
            </p>
          </div>

        </div>
      </div>

      {/* ================= BRAND TAGLINE ================= */}
      <div className="mt-20 py-10 bg-kahawa-dark text-white text-center rounded-lg shadow-inner px-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">
          Powered by Crypto. Inspired by Coffee. ☕
        </h2>
        <p className="text-gray-200 max-w-2xl mx-auto">
          KahawaPay connects the diaspora with loved ones back home — one Bitcoin tip at a time.
        </p>
      </div>

    </div>
  );
}
