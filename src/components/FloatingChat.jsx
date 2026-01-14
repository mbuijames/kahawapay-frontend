import { useState } from "react";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-kahawa-brown text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-xl hover:scale-105 transition"
      >
        💬
      </button>

      {/* Chat Box */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-xl shadow-xl border overflow-hidden">
          <div className="bg-kahawa-brown text-white p-3 font-semibold flex justify-between">
            <span>KahawaPay Support</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="p-3 h-56 text-sm text-gray-600 overflow-y-auto">
            <div className="bg-gray-100 p-2 rounded mb-2">
              👋 Hi! How can we help you today?
            </div>
            <div className="text-xs text-gray-400">
              Live agents coming soon. Email: info@kahawapay.com
            </div>
          </div>

          <div className="p-2 border-t">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full border rounded px-2 py-1 text-sm"
              disabled
            />
          </div>
        </div>
      )}
    </>
  );
}
