import React from "react";
import { FAQS } from "@/lib/landing-content";
import { ChevronDown } from "lucide-react";

export function FAQAccordion() {
  return (
    <section
      id="faq"
      className="py-20 bg-slate-50 border-t border-slate-200/80"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-poppins">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Clear answers about Cloudence workspace storage, sharing, and
            account security.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            return (
              <details
                key={faq.q}
                open={idx === 0}
                className="group bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-colors"
              >
                <summary className="list-none flex items-center justify-between p-5 text-left text-slate-900 font-semibold text-base hover:text-teal-700 transition-colors focus:outline-none cursor-pointer select-none [&::-webkit-details-marker]:hidden">
                  <span className="font-poppins">{faq.q}</span>
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 ml-4 transition-transform duration-200 group-open:rotate-180 group-open:text-teal-600" />
                </summary>
                <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}
