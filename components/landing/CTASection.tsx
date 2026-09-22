import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Check } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-slate-900 text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-xl border border-slate-800">
          {/* Subtle architectural background pattern */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-5"
            style={{
              backgroundImage: `radial-gradient(#2dd4bf 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }}
          />

          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-mono uppercase font-semibold text-teal-400 tracking-wider">
              READY TO GET ORGANIZED?
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-poppins mt-3 leading-tight">
              A quieter home for all your busy files.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              No bloated enterprise suite, no ads, and no hidden subscriptions. Just clean, fast, reliable storage for everything that matters to your projects.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-xl shadow-md transition-all hover:translate-y-[-1px]"
              >
                <span>Create Your Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700/80"
              >
                <span>Sign In to Existing Workspace</span>
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-teal-400" />
                Zero credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-teal-400" />
                Instant email OTP verification
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-teal-400" />
                50MB file upload limit
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
