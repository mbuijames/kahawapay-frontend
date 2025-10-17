import React from 'react'

export default function Terms() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-kahawa-dark">Terms of Service</h1>
      <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>

      <p className="mb-3">
        Welcome to <strong>KahawaPay</strong>. By accessing or using this website, you agree to the following terms:
      </p>

      <h2 className="font-semibold mt-4 mb-2">1. Purpose</h2>
      <p>
        KahawaPay is designed to enable members of the diaspora community to <strong>tip friends and family back home </strong> 
         by converting cryptocurrency into local currency equivalents — symbolically framed as <em>buying a coffee</em>.
      </p>

      <h2 className="font-semibold mt-4 mb-2">2. Not a Money Transfer Service</h2>
      <p>
        KahawaPay is <strong>not a remittance, money transfer, or payment processing service</strong>. 
        All activity on this platform should be understood as <strong>tipping only</strong>.
      </p>

      <h2 className="font-semibold mt-4 mb-2">3. User Responsibility</h2>
      <ul className="list-disc pl-6">
        <li>Users are responsible for ensuring the accuracy of recipient details.</li>
        <li>Tipping amounts and conversion rates are subject to change based on market conditions.</li>
      </ul>

      <h2 className="font-semibold mt-4 mb-2">4. Service Guarantee</h2>
      <p>
	 While KahawaPay is committed to providing a fast, secure, and reliable experience, we guarantee our best efforts to ensure uninterrupted service and accurate processing. However, temporary delays or currency fluctuations may occur due to factors beyond our control.
      </p>

      <h2 className="font-semibold mt-4 mb-2">5. Compliance</h2>
      <p>
        Users must abide by all applicable laws and regulations in their jurisdiction when using KahawaPay.
      </p>
    </div>
  )
}
