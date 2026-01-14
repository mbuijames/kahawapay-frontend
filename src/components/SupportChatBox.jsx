// src/components/SupportChatBox.jsx
import React, { useState } from "react";

export default function SupportChatBox() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="w-80 h-96 bg-white shadow-xl rounded-lg flex flex-col overflow-hidden">
          <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
            <span className="font-semibold">KahawaPay Support</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="flex-1 p-3 text-sm text-gray-600 overflow-y-auto">
            <p>Hello 👋</p>
            <p className="mt-2">
              How can we help you today? Our support team will reply shortly.
            </p>
          </div>

          <div className="border-t p-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full border rounded px-2 py-1 text-sm"
            />
          </div>
        </div>
      )}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center text-xl"
        >
          💬
        </button>
      )}
    </div>
  );
}
