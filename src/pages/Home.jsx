// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";


export default function Home() {
  return (
   <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      {/* ✅ Top Banner (Rates + Bitcoin) */}
      <KahawaPayHero />

      {/* Hero Section */}
      <div className="text-center py-16 px-6">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-10 max-w-6xl mx-auto">
          {/* Text Content */}
          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-kahawa-dark mb-6 leading-tight">
              Buy Your Buddies Back Home a Coffee 
            </h1>

            <p className="text-lg sm:text-xl text-gray-700 max-w-xl mx-auto mb-8">
              Turn your crypto into smiles back home — <br />
              <span className="font-semibold">
                Fast, Easy, and Secure tipping for the diaspora community.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/deposit"
                className="px-6 py-3 bg-kahawa-dark text-white rounded-lg shadow hover:opacity-90 text-lg font-medium"
              >
                Send a Tip
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 bg-white border border-kahawa-dark text-kahawa-dark rounded-lg shadow hover:bg-gray-50 text-lg font-medium"
              >
                Create Account
              </Link>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="flex-1">
            <img
              src="/coffee-illustration.svg"
              alt="Coffee tipping illustration"
              className="w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </div>

      {/* Why Section */}
      <div className="mt-20 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-kahawa-dark">Why KahawaPay?</h2>
        <div className="grid gap-6 sm:grid-cols-3 text-gray-700">
          <div className="p-6 border rounded-lg bg-white shadow hover:shadow-lg transition">
            <h3 className="font-semibold mb-2 text-lg">☕ Simple</h3>
            <p>Just a few clicks to send tips — no complex setup required.</p>
          </div>
          <div className="p-6 border rounded-lg bg-white shadow hover:shadow-lg transition">
            <h3 className="font-semibold mb-2 text-lg">⚡ Fast</h3>
            <p>Your buddies receive local value from crypto almost instantly.</p>
          </div>
          <div className="p-6 border rounded-lg bg-white shadow hover:shadow-lg transition">
            <h3 className="font-semibold mb-2 text-lg">🔒 Secure</h3>
            <p>Backed by blockchain transparency and your control at every step.</p>
          </div>
        </div>
      </div>

      {/* Closing Tagline */}
      <div className="mt-20 py-10 bg-kahawa-dark text-white text-center rounded-lg shadow-inner">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">
          Powered by Crypto. Inspired by Coffee. ☕
        </h2>
        <p className="text-gray-200 max-w-2xl mx-auto">
          KahawaPay connects the diaspora with their buddies back home — one coffee tip at a time.
        </p>
      </div>
    </div>
  );
}
