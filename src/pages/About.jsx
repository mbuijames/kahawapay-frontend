import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-yellow-900 to-yellow-700 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-4">
              Powering Cross-Border Bitcoin Tips to Africa
            </h1>
            <p className="text-lg text-yellow-100">
              KahawaPay makes it effortless for the diaspora to send Bitcoin-powered
              tips and appreciation instantly to loved ones in Africa.
            </p>
          </div>
          <img
            src="/images/africa-crypto-transfer.jpg"
            alt="Africa crypto payments"
            className="rounded-xl shadow-lg"
          />
        </div>
      </div>

      {/* About Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          KahawaPay is a financial technology platform designed to simplify how
          people send small cross-border gifts, tips, and support using Bitcoin.
          We combine blockchain speed with local mobile money rails to ensure
          recipients receive value instantly in their local currency.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          Whether you are in Europe, the US, or the Middle East, KahawaPay allows
          you to send a cup of coffee, a token of appreciation, or emergency
          support back home in seconds — securely and transparently.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Why KahawaPay</h2>
        <ul className="grid md:grid-cols-3 gap-6">
          <li className="bg-white p-4 rounded shadow">
            <strong>Instant Delivery</strong>
            <p className="text-sm text-gray-600">Crypto speed with local settlement.</p>
          </li>
          <li className="bg-white p-4 rounded shadow">
            <strong>Secure & Compliant</strong>
            <p className="text-sm text-gray-600">Enterprise-grade security & audit trails.</p>
          </li>
          <li className="bg-white p-4 rounded shadow">
            <strong>Built for Africa</strong>
            <p className="text-sm text-gray-600">Optimized for mobile money ecosystems.</p>
          </li>
        </ul>

        <div className="mt-10 p-6 bg-white rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
          <p className="text-gray-700">
            Email:{" "}
            <a href="mailto:info@kahawapay.com" className="text-blue-600 underline">
              info@kahawapay.com
            </a>
          </p>
          <p className="text-gray-500 mt-2">
            © 2026 KahawaPay. All rights reserved.
          </p>
        </div>

        <div className="mt-6">
          <Link to="/faq" className="text-blue-600 underline">
            Visit our FAQ →
          </Link>
        </div>
      </div>
    </div>
  );
}
