import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-3">About KahawaPay</h1>

      {/* Block-style paragraph */}
      <div className="bg-gray-50 border-l-4 border-kahawa-brown p-4 rounded">
        <p className="text-gray-700 leading-relaxed text-justify">
          KahawaPay is a digital and innovative way to reach out to family and friends across borders. Using the power of blockchain technology, we make it simple to send tips and small gifts that instantly convert to local currency. Whether you’re buying your loved ones a cup of coffee or sharing a token of appreciation, KahawaPay keeps you connected—fast, secure, and reliable. Enjoy seamless cross-jurisdiction tipping with 24/7 support, all powered by a touch of crypto innovation.
        
		</p>
		<p>
		<strong>Getting Started</strong>
		</p>
		<p className="text-gray-700 leading-relaxed text-justify">
KahawaPay makes it simple to create and log in to your account or wallet and start sending tips instantly. You can also send a tip anonymously without creating an account—perfect for quick gestures of appreciation. However, anonymous tips have a set limit to ensure security and compliance.
		</p>
      </div>

      <p className="mt-4 mb-2">
        Contact us:{" "}
        <a className="text-blue-600 underline" href="mailto:info@kahawapay.com">
          info@kahawapay.com
        </a>
      </p>

      <div className="my-6 p-4 border rounded">
        <h2 className="text-lg font-semibold mb-2">Live Help</h2>
        <p className="text-gray-600 mb-3">Start a chat and we'll get back to you.</p>
        {/* Placeholder Chatbot box; wire to your backend/websocket later */}
        <div className="h-40 border rounded p-2 text-gray-500">Chatbot coming soon…</div>
      </div>

      <Link to="/faq" className="text-blue-600 underline">
        Read our FAQ
      </Link>
    </div>
  );
}
