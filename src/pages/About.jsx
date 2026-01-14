import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            Powering Instant Bitcoin Tips Across Africa
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            KahawaPay is redefining how the African diaspora sends love, support, 
            and appreciation back home — instantly, securely, and without borders.
          </p>
          <div className="flex gap-4">
            <Link
              to="/signup"
              className="bg-amber-600 text-white px-5 py-2 rounded-lg shadow hover:bg-amber-700"
            >
              Get Started
            </Link>
            <Link
              to="/faq"
              className="border border-amber-600 text-amber-700 px-5 py-2 rounded-lg hover:bg-amber-50"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="relative">
          <img
            src="/images/africa-crypto-transfer.jpg"
            alt="Bitcoin remittance to Africa"
            className="rounded-2xl shadow-lg w-full object-cover"
          />
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Our Mission</h2>
        <p className="text-gray-700 leading-relaxed">
          KahawaPay exists to make cross-border micro-payments effortless. We use 
          Bitcoin and blockchain technology to remove delays, high fees, and 
          complexity from traditional remittance systems. Whether it's buying a 
          loved one a cup of coffee, paying school fees, or sending a token of 
          appreciation, KahawaPay delivers value instantly in local currency.
        </p>
      </div>

      {/* Features */}
      <div className="bg-white py-14">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border shadow-sm">
            <h3 className="font-semibold text-lg mb-2">⚡ Instant Settlement</h3>
            <p className="text-gray-600">
              Bitcoin-powered transfers that settle in minutes, not days.
            </p>
          </div>
          <div className="p-6 rounded-xl border shadow-sm">
            <h3 className="font-semibold text-lg mb-2">🔐 Secure by Design</h3>
            <p className="text-gray-600">
              Bank-grade encryption, blockchain transparency, and compliance controls.
            </p>
          </div>
          <div className="p-6 rounded-xl border shadow-sm">
            <h3 className="font-semibold text-lg mb-2">🌍 Built for Africa</h3>
            <p className="text-gray-600">
              Seamless conversion to KES, UGX, TZS and more — delivered locally.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-5xl mx-auto px-6 py-10 text-center">
        <p className="text-gray-600">
          Need help? Reach us at{" "}
          <a
            href="mailto:info@kahawapay.com"
            className="text-amber-600 font-medium underline"
          >
            info@kahawapay.com
          </a>
        </p>

        <p className="text-sm text-gray-400 mt-4">
          © {new Date().getFullYear()} KahawaPay. All rights reserved.
        </p>
      </div>
    </div>
  );
}
