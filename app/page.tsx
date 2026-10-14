import type { Metadata } from "next";
import { Suspense } from "react";
import { FAQS } from "@/lib/landing-content";
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
  title: { absolute: "Cloudence | Focused Cloud Workspace for Your Files" },
  description:
    "A clean, dependable cloud storage and sharing workspace for documents, images, and media. Engineered by Chefu Technologies with instant search and OTP security.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Cloudence | Focused Cloud Workspace for Your Files",
    description:
      "A clean, dependable cloud storage and sharing workspace for documents, images, and media. Engineered by Chefu Technologies with instant search and OTP security.",
    url: "https://cloudence.chefu.co.za",
    siteName: "Cloudence",
    locale: "en_US",
    type: "website",
  },
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

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Cloudence",
  operatingSystem: "Web",
  applicationCategory: "BusinessApplication",
  url: "https://cloudence.chefu.co.za",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "A clean, dependable cloud storage and sharing workspace for documents, images, and media. Engineered by Chefu Technologies.",
};

const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

async function PersonalizedNavbar({ user }: { user: ReturnType<typeof getCurrentUser> }) {
  return <LandingNavbar user={await user} />;
}

async function PersonalizedHero({ user }: { user: ReturnType<typeof getCurrentUser> }) {
  return <HeroSection user={await user} />;
}

export default function HomePage() {
  const currentUser = getCurrentUser();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageSchema),
        }}
      />
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
        {/* Sticky Navigation Bar */}
        <Suspense fallback={<LandingNavbar user={null} />}>
          <PersonalizedNavbar user={currentUser} />
        </Suspense>

        {/* Main Content Sections */}
        <main id="main-content">
          {/* 1. Hero with Value Proposition & Quick Proof */}
          <Suspense fallback={<HeroSection user={null} />}>
            <PersonalizedHero user={currentUser} />
          </Suspense>

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

          {/* 7. Call To Action Banner */}
          <CTASection />
        </main>

        {/* 8. Enterprise Footer */}
        <LandingFooter />
      </div>
    </>
  );
}
