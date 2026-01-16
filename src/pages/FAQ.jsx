import React, { useEffect } from "react";

const faqs = [
  {
    question: "How do I send a tip?",
    answer:
      "Go to the Send page, enter the BTC amount and the recipient’s phone number, then confirm the transaction."
  },
  {
    question: "What happens after I enter the amount?",
    answer:
      "After you enter the amount, a BTC address will be generated for you."
  },
  {
    question: "What should I do after the BTC address is generated?",
    answer:
      "After you complete the process, you are supposed to copy the BTC address and then send the BTC that you had indicated you want to send. Once you send, you will receive a confirmation to your email that the transaction is successful."
  },
  {
    question: "Do I need an account to send?",
    answer:
      "You can send as a guest with limited features, or register to get higher limits and your own wallet."
  },
  {
    question: "How long does confirmation take?",
    answer:
      "Confirmation time depends on the Bitcoin network, but you will receive an email once the transaction is confirmed."
  },
  {
    question: "Which currencies are supported?",
    answer:
      "Supported currencies depend on the current exchange rate configuration set by the admin."
  },
  {
    question: "Is my transaction secure?",
    answer:
      "Yes. All transactions are recorded on the Bitcoin blockchain and verified before confirmation."
  }
];

export default function FAQ() {
  useEffect(() => {
    document.title = "FAQ – KahawaPay";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Frequently Asked Questions about KahawaPay: sending Bitcoin tips, copying BTC address, confirmation, and supported currencies."
      );
    }

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

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <section className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h1>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="border rounded-lg p-4 cursor-pointer group"
          >
            <summary className="font-semibold flex justify-between items-center">
              {faq.question}
              <span className="text-gray-400 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <p className="mt-2 text-gray-700 leading-relaxed">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
