import React, { useEffect } from "react";

const faqs = [
  {
    question: "How do I send a tip?",
    answer: "Go to the Send page, enter BTC amount and recipient phone, and confirm."
  },
  {
    question: "Do I need an account?",
    answer: "You can send as a guest (limited), or register for higher limits and a wallet."
  },
  {
    question: "Which currencies are supported?",
    answer: "See Admin > Exchange Rates for currently configured currencies."
  }
];

export default function FAQ() {
  // SEO: set title, meta description, and structured data
  useEffect(() => {
    document.title = "FAQ – KahawaPay";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Frequently Asked Questions about KahawaPay: sending tips, account setup, and supported currencies."
      );
    }

    // Add JSON-LD structured data for FAQ
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    // Clean up script on unmount
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <section className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">FAQ</h1>
      <dl className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index}>
            <dt className="font-semibold">{faq.question}</dt>
            <dd className="mt-1 text-gray-700">{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
