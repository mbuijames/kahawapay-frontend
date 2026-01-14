import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-full shadow-lg z-50"
      >
        <MessageCircle size={22} />
      </button>

      {/* Chat Box */}
      {open && (
        <div className="fixed bottom-20 right-5 w-80 bg-white rounded-xl shadow-2xl border z-50">
          <div className="flex items-center justify-between bg-amber-600 text-white px-4 py-3 rounded-t-xl">
            <span className="font-semibold">KahawaPay Support</span>
            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="p-4 h-64 overflow-y-auto text-sm text-gray-700">
            <p className="mb-2">
              👋 Hi! Welcome to KahawaPay.
            </p>
            <p className="mb-2">
              How can we help you today?
            </p>
            <p className="text-gray-500 text-xs">
              (Live agent coming soon. For now, email us at info@kahawapay.com)
            </p>
          </div>

          <div className="border-t p-2">
            <input
              type="text"
              placeholder="Type your message…"
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none"
              disabled
            />
          </div>
        </div>
      )}
    </>
  );
}
