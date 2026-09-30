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
  mainEntity: [
    {
      "@type": "Question",
      name: "What file formats does Cloudence support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cloudence accepts all standard file formats: PDF, Microsoft Word (DOC/DOCX), Excel spreadsheets (XLS/XLSX), presentations, vector images (SVG), raster photography (PNG, JPG, WebP), high-definition video (MP4, MOV, WebM), audio recordings, and ZIP/TAR archives.",
      },
    },
    {
      "@type": "Question",
      name: "What is the maximum file upload size?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cloudence supports direct uploads of up to 50MB per individual file. This limit is optimized for high-speed network transmission and direct cloud CDN caching without browser memory timeouts.",
      },
    },
    {
      "@type": "Question",
      name: "How does the authentication system work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cloudence utilizes centralized passwordless authentication. When you sign in or register, you receive a time-limited 6-digit one-time password (OTP) in your verified email inbox. This eliminates password reuse vulnerabilities and credential stuffing attacks.",
      },
    },
    {
      "@type": "Question",
      name: "Can I share files with clients or external collaborators?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. From any file's action menu, you can generate a direct secure share link or specify team collaborator emails. Recipients can preview or download the file with verified access controls.",
      },
    },
    {
      "@type": "Question",
      name: "How is my storage quota calculated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your storage meter tracks the total byte size of all active files across your account. Cloudence visualizes this in real time across four clear categories: Documents, Images, Media, and Others. When you delete a file, the space is immediately reclaimed.",
      },
    },
    {
      "@type": "Question",
      name: "Where is my data stored and hosted?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cloudence leverages enterprise-grade cloud infrastructure, with file assets and media streams delivered through globally distributed CDN nodes, while user authentication and metadata are securely managed through Chefu backend services.",
      },
    },
  ],
};

export default async function HomePage() {
  const currentUser = await getCurrentUser();

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
        <LandingNavbar user={currentUser} />

        {/* Main Content Sections */}
        <main id="main-content">
          {/* 1. Hero with Value Proposition & Quick Proof */}
          <HeroSection user={currentUser} />

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

