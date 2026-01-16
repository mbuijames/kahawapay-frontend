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
      "After you complete the process, you are supposed to copy the BTC address and then send the BTC that you had indicated to send. Once you send, you will receive a confirmation to your email that the transaction is successful."
  },
  {
    question: "Do I need an account?",
    answer:
      "You can send as a guest with limited access, or register for higher limits and your own wallet."
  },
  {
    question: "How long does confirmation take?",
    answer:
      "Bitcoin confirmations depend on network traffic, but email confirmation is sent once the transaction is verified."
  },
  {
    question: "Is KahawaPay secure?",
    answer:
      "Yes. All transactions are secured by the Bitcoin blockchain and industry-standard encryption."
  }
];

export default function FAQ() {
  useEffect(() => {
    document.title = "FAQ – KahawaPay";
  }, []);

  return (
    <div className="bg-gradient-to-br from-amber-50 to-white">
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-md p-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 mb-10">
            Everything you need to know about sending Bitcoin tips through KahawaPay.
          </p>

          <div className="space-y-5">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group border border-gray-200 rounded-xl px-5 py-4"
              >
                <summary className="cursor-pointer font-medium text-gray-800 flex justify-between items-center">
                  {faq.question}
                  <span className="text-amber-600 group-open:rotate-180 transition-transform">
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
    </div>
  );
}
