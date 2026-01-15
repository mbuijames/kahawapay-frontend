import { useState } from "react";

export default function SupportChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-5 bg-white shadow-xl rounded-xl p-4 w-80">
          {/* your form here */}
        </div>
      )}

      {/* Floating Button (PUT THE ICON HERE) */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 w-14 h-14 bg-yellow-400 rounded-2xl shadow-lg flex items-center justify-center hover:scale-105 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#111827"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-7 h-7"
        >
          <path d="M3 11a9 9 0 0 1 18 0" />
          <path d="M21 11v5a2 2 0 0 1-2 2h-2" />
          <path d="M3 11v5a2 2 0 0 0 2 2h-2" />
          <path d="M10 19h4" />
        </svg>
      </button>
    </>
  );
}
