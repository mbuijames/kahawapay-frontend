import React from "react";

export default function Terms() {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-white">
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-md p-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Terms of Service
          </h1>
          <p className="text-gray-600 mb-8">
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          <p className="mb-6 text-gray-700">
            Welcome to <strong>KahawaPay</strong>. By accessing or using this
            website and its services, you agree to be bound by the following
            Terms of Service. If you do not agree, please do not use the
            platform.
          </p>

          <h2 className="font-semibold text-lg mt-6 mb-2">1. Purpose of Service</h2>
          <p className="text-gray-700">
            KahawaPay enables members of the diaspora to <strong>tip friends and
            family back home</strong> by facilitating the conversion of Bitcoin
            into local currency equivalents, symbolically framed as{" "}
            <em>buying a coffee</em>.
          </p>

          <h2 className="font-semibold text-lg mt-6 mb-2">
            2. Not a Money Transfer or Remittance Service
          </h2>
          <p className="text-gray-700">
            KahawaPay is <strong>not a bank, remittance company, or money
            transfer service</strong>. All transactions are treated as voluntary
            tips. KahawaPay does not hold customer funds or provide custody
            services.
          </p>

          <h2 className="font-semibold text-lg mt-6 mb-2">3. User Responsibilities</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Ensure recipient details are accurate before sending.</li>
            <li>Confirm the Bitcoin amount and wallet address carefully.</li>
            <li>Understand that blockchain transactions are irreversible.</li>
            <li>Comply with all local and international laws.</li>
          </ul>

          <h2 className="font-semibold text-lg mt-6 mb-2">
            4. Transaction Confirmation
          </h2>
          <p className="text-gray-700">
            After copying the provided Bitcoin address and sending the specified
            amount, the transaction will be processed on the Bitcoin blockchain.
            A confirmation email will be sent once the transaction is verified.
          </p>

          <h2 className="font-semibold text-lg mt-6 mb-2">
            5. Fees and Exchange Rates
          </h2>
          <p className="text-gray-700">
            Exchange rates and service fees may fluctuate due to market
            conditions and liquidity providers. Displayed estimates may differ
            slightly from final settlement values.
          </p>

          <h2 className="font-semibold text-lg mt-6 mb-2">
            6. Service Availability
          </h2>
          <p className="text-gray-700">
            While we strive for uninterrupted service, KahawaPay does not
            guarantee continuous availability. Maintenance, network congestion,
            or third-party failures may cause delays.
          </p>

          <h2 className="font-semibold text-lg mt-6 mb-2">
            7. Risk Disclosure
          </h2>
          <p className="text-gray-700">
            Cryptocurrency values are volatile. By using KahawaPay, you accept
            the risk of price fluctuations and network delays.
          </p>

          <h2 className="font-semibold text-lg mt-6 mb-2">
            8. Anti-Fraud and Compliance
          </h2>
          <p className="text-gray-700">
            We reserve the right to suspend or block transactions suspected of
            fraud, money laundering, or illegal activity and may cooperate with
            regulatory authorities when required.
          </p>

          <h2 className="font-semibold text-lg mt-6 mb-2">
            9. Limitation of Liability
          </h2>
          <p className="text-gray-700">
            KahawaPay shall not be liable for losses arising from incorrect
            addresses, blockchain failures, network congestion, or user error.
          </p>

          <h2 className="font-semibold text-lg mt-6 mb-2">
            10. Account Termination
          </h2>
          <p className="text-gray-700">
            We may suspend or terminate access to the platform at any time for
            violation of these terms or applicable laws.
          </p>

          <h2 className="font-semibold text-lg mt-6 mb-2">
            11. Changes to Terms
          </h2>
          <p className="text-gray-700">
            These terms may be updated periodically. Continued use of KahawaPay
            constitutes acceptance of the revised terms.
          </p>

          <h2 className="font-semibold text-lg mt-6 mb-2">
            12. Governing Law
          </h2>
          <p className="text-gray-700">
            These terms shall be governed by and interpreted in accordance with
            applicable laws in the jurisdictions where KahawaPay operates.
          </p>

          <p className="mt-8 text-gray-600">
            For questions, contact{" "}
            <a
              href="mailto:info@kahawapay.com"
              className="text-amber-600 font-medium underline"
            >
              info@kahawapay.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
