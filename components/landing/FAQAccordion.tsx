"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FAQAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "What file formats does Cloudence support?",
      a: "Cloudence accepts all standard file formats: PDF, Microsoft Word (DOC/DOCX), Excel spreadsheets (XLS/XLSX), presentations, vector images (SVG), raster photography (PNG, JPG, WebP), high-definition video (MP4, MOV, WebM), audio recordings, and ZIP/TAR archives.",
    },
    {
      q: "What is the maximum file upload size?",
      a: "Cloudence supports direct uploads of up to 50MB per individual file. This limit is optimized for high-speed network transmission and direct cloud CDN caching without browser memory timeouts.",
    },
    {
      q: "How does the authentication system work?",
      a: "Cloudence utilizes our centralized passwordless authentication. When you sign in or register, you receive a time-limited 6-digit one-time password (OTP) in your verified email inbox. This eliminates password reuse vulnerabilities and credential stuffing attacks.",
    },
    {
      q: "Can I share files with clients or external collaborators?",
      a: "Yes. From any file's action menu, you can generate a direct secure share link or specify team collaborator emails. Recipients can preview or download the file with verified access controls.",
    },
    {
      q: "How is my storage quota calculated?",
      a: "Your storage meter tracks the total byte size of all active files across your account. Cloudence visualizes this in real time across four clear categories: Documents, Images, Media, and Others. When you delete a file, the space is immediately reclaimed.",
    },
    {
      q: "Where is my data stored and hosted?",
      a: "Cloudence leverages enterprise-grade cloud infrastructure, with file assets and media streams delivered through globally distributed CDN nodes, while user authentication and metadata are securely managed through our backend services.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
         
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-poppins">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Clear answers about Cloudence workspace storage, sharing, and account security.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.q}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-slate-900 font-semibold text-base hover:text-teal-700 transition-colors focus:outline-none"
                >
                  <span className="font-poppins">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 ml-4 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-teal-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
