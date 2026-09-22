import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, HardDrive, Lock, FileCheck2, ArrowUpRight } from "lucide-react";
import { getCurrentUser } from "@/lib/actions/user.actions";
import type { LandingUser } from "./LandingNavbar";

interface HeroSectionProps {
  user?: LandingUser | null;
}

export async function HeroSection({ user: propUser }: HeroSectionProps = {}) {
  const user = propUser !== undefined ? propUser : await getCurrentUser();
  const isAuthenticated = Boolean(user);

  return (
    <section className="relative pt-8 pb-16 md:pt-16 md:pb-24 overflow-hidden">
      {/* Architectural Background Grid - subtle and precise, NOT blurry AI gradients */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] -z-10"
        style={{
          backgroundImage: `radial-gradient(#0f172a 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Very subtle architectural glow accent in brand teal - grounded, not neon */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[680px] h-[340px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight font-poppins leading-[1.12]">
            Everything you keep,{" "}
            <span className="text-teal-700 underline decoration-teal-300/60 decoration-wavy decoration-2 underline-offset-8">
              right where you left it.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            Cloudence is a focused, clutter-free file repository for documents, imagery, and 4K media. Built for speed, disciplined organization, and frictionless sharing.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href={isAuthenticated ? "/dashboard" : "/sign-up"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-700/20 hover:shadow-teal-700/30 transition-all hover:translate-y-[-1px] group"
            >
              <span>{isAuthenticated ? "Go to Workspace" : "Create Free Account"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#interactive-demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl shadow-sm hover:border-slate-300 transition-all text-center"
            >
              <span>Try Live Interactive Demo</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          {/* Value Proof Badges */}
          <div className="mt-12 pt-8 border-t border-slate-200/70 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-md bg-teal-50 text-teal-700 shrink-0 mt-0.5">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Instant Search</p>
                <p className="text-[11px] text-slate-500">Debounced &lt;50ms query</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-md bg-teal-50 text-teal-700 shrink-0 mt-0.5">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">50MB Direct Uploads</p>
                <p className="text-[11px] text-slate-500">Fast multi-part chunks</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-md bg-teal-50 text-teal-700 shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">OTP Auth Protection</p>
                <p className="text-[11px] text-slate-500">SSO Unified Identity</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-md bg-teal-50 text-teal-700 shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Zero Ad-Trackers</p>
                <p className="text-[11px] text-slate-500">100% private data</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
