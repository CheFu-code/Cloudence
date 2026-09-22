import React from "react";
import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { ExternalLink, ShieldCheck, Heart } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <BrandLogo className="text-white" />
            <p className="mt-4 text-xs text-slate-400 leading-relaxed max-w-sm">
              Cloudence is a focused, clutter-free file repository and sharing platform engineered by{" "}
              <strong className="text-slate-200 font-semibold">CHEFU TECHNOLOGIES (Pty) Ltd.</strong> Designed for speed, disciplined organization, and zero-distraction productivity.
            </p>

          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-mono uppercase font-semibold text-slate-200 tracking-wider mb-4">
              Workspace
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#interactive-demo" className="hover:text-white transition-colors">
                  Interactive Sandbox
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Instant File Search
                </a>
              </li>
              <li>
                <a href="#storage" className="hover:text-white transition-colors">
                  Storage Allocation
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-white transition-colors">
                  Security Architecture
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Access */}
          <div>
            <h4 className="text-xs font-mono uppercase font-semibold text-slate-200 tracking-wider mb-4">
              Access
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/sign-in" className="hover:text-white transition-colors">
                  Sign In to Workspace
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-white transition-colors">
                  Create New Account
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  User Dashboard
                </Link>
              </li>
              <li>
                <a
                  href="https://www.chefu.co.za"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Chefu Technologies Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div>
            <h4 className="text-xs font-mono uppercase font-semibold text-slate-200 tracking-wider mb-4">
              Governance
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <span className="text-slate-500">Zero-Tracking Guarantee</span>
              </li>
              <li>
                <span className="text-slate-500">Encrypted Transit (TLS 1.3)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} CHEFU TECHNOLOGIES (Pty) Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-300">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-slate-300">
              Terms
            </Link>
            <a href="https://www.chefu.co.za" className="hover:text-slate-300">
              www.chefu.co.za
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
