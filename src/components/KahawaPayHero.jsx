// src/components/KahawaPayTopBanner.jsx
import React from "react";

/**
 * KahawaPayTopBanner.jsx
 * Minimal component that renders only the top highlighted banner.
 * Use this instead of the full hero to avoid duplicating the main body.
 */

export default function KahawaPayTopBanner() {
  return (
    <div className="bg-transparent">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="border-4 border-black h-16 rounded-sm bg-white flex items-center p-4">
          <div className="w-full flex items-center justify-between">
            {/* left side - keep empty or add logo/search */}
            <div className="text-gray-700" />

            {/* right side - announcement / search text */}
            <div className="text-right">
              <span className="text-sm text-gray-500">Announcement or Search box</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
