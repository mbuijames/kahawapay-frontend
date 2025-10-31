import React from "react";

// KahawaPayHero.jsx
// Single-file React component that splits the top highlighted area into
// a separate TopBanner component and the main Hero content.
// Uses TailwindCSS for styling. If you don't use Tailwind, the classNames
// are annotated so you can convert them to plain CSS.

export default function KahawaPayHero() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top banner / highlighted area */}
      <TopBanner />

      {/* Main hero section */}
      <main className="max-w-5xl mx-auto mt-8 bg-white shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-12 items-center">
          <div>
            <h1 className="text-5xl font-extrabold text-brown-800 leading-tight">
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
              <button className="px-6 py-3 rounded-lg bg-brown-700 text-white shadow">Send a Tip</button>
              <button className="px-6 py-3 rounded-lg border border-gray-300">Create Account</button>
            </div>
          </div>

          <div className="flex justify-center">
            {/* Placeholder for coffee image */}
            <div className="w-64 h-64 bg-coffee-pattern rounded-full"></div>
          </div>
        </div>
      </main>
    </div>
  );
}

function TopBanner() {
  return (
    <div className="bg-transparent">
      {/* Container centers the banner and gives it the outlined box look */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="border-4 border-black h-16 rounded-sm bg-white flex items-center p-4">
          {/* Replace the inner content with whatever should live in the highlighted area */}
          <div className="w-full flex items-center justify-between">
            <div className="text-gray-700"> <!-- left side (empty in screenshot) -->
            </div>

            <div className="text-right">
              <span className="text-sm text-gray-500">Announcement or Search box can go here</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
Tailwind color utilities used above like text-brown-800 and bg-brown-700 are custom names.
If you don't have those in your Tailwind config, replace them with e.g. text-gray-900 or bg-gray-800.

If you prefer plain CSS instead of Tailwind, convert the classes:
- .max-w-5xl { max-width: 64rem; margin-left: auto; margin-right: auto; }
- .px-4 { padding-left: 1rem; padding-right: 1rem; } etc.

How to use:
- Save this file as KahawaPayHero.jsx and import it in your App.jsx:
    import KahawaPayHero from './KahawaPayHero';
    <KahawaPayHero />

- To place different content into the highlighted TopBanner, modify the TopBanner() JSX.
*/
