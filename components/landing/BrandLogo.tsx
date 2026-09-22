import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  className?: string;
  showBadge?: boolean;
}

export function BrandLogo({ className = "", showBadge = false }: BrandLogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group focus:outline-none ${className}`}>
      {/* Cloudence Geometric Brand Emblem */}
      <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 shadow-sm shadow-teal-900/10 group-hover:scale-105 transition-transform duration-200">
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-white"
        >
          <path
            d="M21.5 14.5C21.5 11.4624 19.0376 9 16 9C13.4357 9 11.2727 10.7582 10.6552 13.1257C8.5833 13.3857 7 15.1384 7 17.25C7 19.5972 8.90279 21.5 11.25 21.5H21C23.2091 21.5 25 19.7091 25 17.5C25 15.8924 23.9538 14.5292 22.4828 14.0729"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 15V22M16 22L13.5 19.5M16 22L18.5 19.5"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-current text-lg tracking-tight font-poppins transition-colors">
            Cloudence
          </span>
          {showBadge && (
            <span className="px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase bg-teal-50 text-teal-700 border border-teal-200/60 rounded">
              v1.0
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
