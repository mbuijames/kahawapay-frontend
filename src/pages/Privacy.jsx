import React from "react";

export default function Privacy() {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-white">
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-md p-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-gray-600 mb-8">
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          <h2 className="font-semibold text-lg mt-6 mb-2">1. Respect for Privacy</h2>
          <p className="text-gray-700">
            KahawaPay respects every user’s right to <strong>privacy and freedom</strong>.
            We collect only the minimum personal information necessary to operate
            the service securely and efficiently.
          </p>

          <h2 className="font-semibold text-lg mt-6 mb-2">2. Information We Collect</h2>
          <p className="text-gray-700">
            This may include account details, contact information, transaction
            references, and technical data required to provide and protect the
            platform.
          </p>

          <h2 className="font-semibold text-lg mt-6 mb-2">3. Use of Data</h2>
          <p className="text-gray-700">
            Information provided is used strictly for service delivery, security,
            fraud prevention, compliance, and communication related to your
            transactions.
          </p>

          <h2 className="font-semibold text-lg mt-6 mb-2">4. No Sale of Data</h2>
          <p className="text-gray-700">
            We do not sell, rent, or trade your personal information with third
            parties. Data is shared only with trusted service providers where
            necessary to operate the platform.
          </p>

          <h2 className="font-semibold text-lg mt-6 mb-2">5. Data Security</h2>
          <p className="text-gray-700">
            We use industry-standard security measures, encryption, and access
            controls to protect your information from unauthorized access or
            disclosure.
          </p>

          <h2 className="font-semibold text-lg mt-6 mb-2">6. Legal Compliance</h2>
          <p className="text-gray-700">
            KahawaPay complies with applicable data protection and privacy laws in
            the regions where we operate.
          </p>

          <h2 className="font-semibold text-lg mt-6 mb-2">7. Your Rights</h2>
          <p className="text-gray-700">
            You have the right to access, correct, or request deletion of your
            personal data, subject to legal and regulatory requirements.
          </p>

          <h2 className="font-semibold text-lg mt-6 mb-2">8. Policy Updates</h2>
          <p className="text-gray-700">
            This Privacy Policy may be updated periodically. Continued use of the
            platform constitutes acceptance of the revised policy.
          </p>

          <p className="mt-8 text-gray-600">
            For privacy-related questions, contact{" "}
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
