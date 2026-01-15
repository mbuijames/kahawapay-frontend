import { useState } from "react";
import api from "./api"; // same axios instance you use elsewhere

export default function SupportChat() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const brand = "#5a3a22";

  const handleSend = async () => {
    try {
      setSending(true);
      await api.post("/support/contact", form);
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      alert("Failed to send message. Please try again.");
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-5 shadow-xl rounded-xl p-4 w-80 z-50 bg-white border"
             style={{ borderColor: brand }}>
          <h3 className="font-bold mb-2" style={{ color: brand }}>
            Chat with KahawaPay
          </h3>

          {sent ? (
            <p className="text-sm" style={{ color: brand }}>
              Message sent. We will reply shortly.
            </p>
          ) : (
            <>
              <input
                className="w-full border p-2 mb-2 rounded"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="w-full border p-2 mb-2 rounded"
                placeholder="Your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <textarea
                className="w-full border p-2 mb-2 rounded"
                placeholder="Your message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />

              <button
                onClick={handleSend}
                disabled={sending}
                className="w-full text-white p-2 rounded"
                style={{ backgroundColor: brand }}
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </>
          )}
        </div>
      )}

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
