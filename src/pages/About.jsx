import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-3">About KahawaPay</h1>

      {/* Block-style paragraph */}
      <div className="bg-gray-50 border-l-4 border-kahawa-brown p-4 rounded">
        <p className="text-gray-700 leading-relaxed text-justify">
          KahawaPay is a fast, secure, and innovative crypto-powered platform that helps people in the diaspora send tips, appreciation gifts, and small cross-border payments to family and friends in Africa. By using blockchain and Bitcoin technology, KahawaPay makes it simple, affordable, and instant to support loved ones back home—no matter where you are in the world.
        </p>

        <p className="text-gray-700 leading-relaxed text-justify mt-3">
          With seamless crypto-to-local-currency conversion, you can send Bitcoin, USDT, or a small token of appreciation, and your recipient in Africa receives it instantly in their local currency. KahawaPay is designed to be fast, secure, and reliable, offering 24/7 global access without the friction of traditional remittance services.
        </p>

        <p className="font-semibold mt-4">Getting Started</p>

        <p className="text-gray-700 leading-relaxed text-justify">
          Getting started with KahawaPay is simple. Create your KahawaPay wallet and start sending Bitcoin or crypto tips instantly to Kenya and other African countries. You can also send tips anonymously without creating an account—perfect for quick gifts or surprise gestures of appreciation. To keep users safe, anonymous tips include built-in security limits and compliance controls.
        </p>
      </div>

      <p className="mt-4 mb-2">
        For help or inquiries, contact us at{" "}
        <a className="text-blue-600 underline" href="mailto:info@kahawapay.com">
          info@kahawapay.com
        </a>
      </p>

      <div className="my-6 p-4 border rounded">
        <h2 className="text-lg font-semibold mb-2">Live Help</h2>
        <p className="text-gray-600 mb-3">Start a chat and we'll get back to you.</p>

        {/* Placeholder Chatbot box */}
        <div className="h-40 border rounded p-2 text-gray-500">
          Chatbot coming soon…
        </div>
      </div>

      <Link to="/faq" className="text-blue-600 underline">
        Read our FAQ
      </Link>
    </div>
  );
}
