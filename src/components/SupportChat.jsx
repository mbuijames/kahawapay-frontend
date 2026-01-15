import { useState } from "react";

export default function SupportChat() {
  const [open, setOpen] = useState(false);
  const brand = "#5a3a22";

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div
          className="fixed bottom-24 right-5 shadow-xl rounded-xl p-4 w-80 z-50 bg-white border"
          style={{ borderColor: brand }}
        >
          <h3 className="font-bold mb-2" style={{ color: brand }}>
            Chat with KahawaPay
          </h3>

          <input
            className="w-full border p-2 mb-2 rounded"
            placeholder="Your name"
          />
          <input
            className="w-full border p-2 mb-2 rounded"
            placeholder="Your email"
          />
          <textarea
            className="w-full border p-2 mb-2 rounded"
            placeholder="Your message"
          />

          <button
            className="w-full text-white p-2 rounded"
            style={{ backgroundColor: brand }}
          >
            Send
          </button>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center hover:scale-105 transition z-50"
        style={{ backgroundColor: brand }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
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
