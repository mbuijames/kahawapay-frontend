import React from 'react'

export default function Privacy() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-kahawa-dark">Privacy Policy</h1>
      <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>

      <h2 className="font-semibold mt-4 mb-2">1. Respect for Privacy</h2>
      <p>
        KahawaPay respects every user’s right to <strong>privacy and freedom</strong>. 
        We collect only the minimum personal information necessary to operate the service.
      </p>

      <h2 className="font-semibold mt-4 mb-2">2. Use of Data</h2>
      <p>
        Information provided (e.g., login credentials, transaction details) is used only to deliver the service 
        and maintain security.
      </p>

      <h2 className="font-semibold mt-4 mb-2">3. No Sale of Data</h2>
      <p>
        We do not sell, rent, or trade your personal information with third parties.
      </p>

      <h2 className="font-semibold mt-4 mb-2">4. Legal Compliance</h2>
      <p>
        We comply with <strong>applicable privacy and data protection regulations</strong> 
        in all regions where we operate.
      </p>

      <h2 className="font-semibold mt-4 mb-2">5. Your Rights</h2>
      <p>
        Users have the right to access, correct, or request deletion of their personal information by contacting us.
      </p>
    </div>
  )
}
