import type { Metadata } from "next";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { InteractiveWorkspaceDemo } from "@/components/landing/InteractiveWorkspaceDemo";
import { FeatureHighlights } from "@/components/landing/FeatureHighlights";
import { StorageBreakdownSection } from "@/components/landing/StorageBreakdownSection";
import { SecurityArchitecture } from "@/components/landing/SecurityArchitecture";
import { FAQAccordion } from "@/components/landing/FAQAccordion";
import { CTASection } from "@/components/landing/CTASection";
import { LandingFooter } from "@/components/landing/LandingFooter";

import { getCurrentUser } from "@/lib/actions/user.actions";

export const metadata: Metadata = {
  title: "Cloudence | Focused Cloud Workspace for Your Files",
  description:
    "A clean, dependable cloud storage and sharing workspace for documents, images, and media. Engineered by Chefu Technologies with instant search and OTP security.",
  keywords: [
    "cloud storage",
    "file workspace",
    "Chefu Technologies",
    "Cloudence",
    "secure file sharing",
    "document management",
    "Chefu Unified OTP",
  ],
};

export default async function HomePage() {
  const currentUser = await getCurrentUser();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
      {/* Sticky Navigation Bar */}
      <LandingNavbar user={currentUser} />

      {/* Main Content Sections */}
      <main>
        {/* 1. Hero with Value Proposition & Quick Proof */}
        <HeroSection />

        {/* 2. Live Interactive Workspace Sandbox */}
        <InteractiveWorkspaceDemo />

        {/* 3. Four Core Architectural Pillars */}
        <FeatureHighlights />

        {/* 4. Storage Quota & Capacity Breakdown */}
        <StorageBreakdownSection />

        {/* 5. Enterprise Security & Chefu Infrastructure */}
        <SecurityArchitecture />

        {/* 6. Frequently Asked Questions */}
        <FAQAccordion />

      </main>

      {/* 8. Enterprise Footer */}
      <LandingFooter />
    </div>
  );
}
