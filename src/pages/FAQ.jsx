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
  }
];

export default function FAQ() {
  useEffect(() => {
    document.title = "FAQ – KahawaPay";
  }, []);

  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <div className="bg-white rounded-2xl shadow-md p-10">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Frequently Asked Questions</h1>
        <p className="text-gray-600 mb-10">
          Find answers to common questions about sending Bitcoin tips and how KahawaPay works.
        </p>

        <div className="space-y-5">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group border border-gray-200 rounded-xl px-5 py-4"
            >
              <summary className="cursor-pointer font-medium text-gray-800 flex justify-between items-center">
                {faq.question}
                <span className="text-gray-400 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-3 text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
