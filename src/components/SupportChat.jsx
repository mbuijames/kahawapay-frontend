import { useState } from "react";
import api from "../services/api";

export default function SupportChat() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/support/contact", form);
    setSent(true);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-xl rounded-xl p-4 w-80">
      <h3 className="font-bold text-lg mb-2">Chat with KahawaPay</h3>

      {sent ? (
        <p className="text-green-600">Message sent. We'll reply shortly.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            className="w-full border p-2 rounded"
            placeholder="Your name"
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="w-full border p-2 rounded"
            placeholder="Your email"
            type="email"
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Type your message..."
            onChange={e => setForm({ ...form, message: e.target.value })}
            required
          />
          <button className="w-full bg-brown-700 text-white p-2 rounded">
            Send
          </button>
        </form>
      )}
    </div>
  );
}
