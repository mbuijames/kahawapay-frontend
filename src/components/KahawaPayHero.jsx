import React from "react";
import { Link } from "react-router-dom";

/**
 * KahawaPayHero.jsx
 * - Lightweight hero that aligns with App.jsx main container (max-w-4xl).
 * - Optional top banner controlled by `showBanner` prop.
 * - Use in Home.jsx or Shell depending on whether you want it site-wide.
 */

export default function KahawaPayHero({ showBanner = true }) {
  return (
    <div>
      {showBanner && <TopBanner />}

      {/* Main hero section (keeps width consistent with App main) */}
      <main className="max-w-4xl mx-auto mt-8 bg-white shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-12 items-center">
          <div>
            <h1 className="text-5xl font-extrabold text-gray-800 leading-tight">
              Buy Your
              <br />
              Buddies Back
              <br />
              Home a Coffee
            </h1>

            <p className="mt-8 text-lg text-gray-600">
              Turn your crypto into smiles back home —
              <br />
              <strong>Fast, Easy, and Secure</strong> tipping for the
              diaspora community.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                to="/send"
                className="px-6 py-3 rounded-lg bg-gray-800 text-white shadow inline-block"
              >
                Send a Tip
              </Link>

              <Link
                to="/register"
                className="px-6 py-3 rounded-lg border border-gray-300 inline-block"
              >
                Create Account
              </Link>
            </div>
          </div>

          <div className="flex justify-center">
            {/* Replace with actual <img src=.../> or keep as placeholder */}
            <div className="w-64 h-64 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-sm text-gray-400">Coffee image</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function TopBanner() {
  return (
    <div className="bg-transparent">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="border-4 border-black h-16 rounded-sm bg-white flex items-center p-4">
          <div className="w-full flex items-center justify-between">
            <div className="text-gray-700">{/* left side empty (or logo/search) */}</div>

            <div className="text-right">
              <span className="text-sm text-gray-500">Announcement or Search box</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
