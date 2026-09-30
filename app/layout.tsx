import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
  preload: true,
});

export const viewport: Viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://cloudence.chefu.co.za"),
  title: {
    default: "Cloudence | Focused Cloud Workspace for Your Files",
    template: "%s | Cloudence",
  },
  description:
    "A clean, dependable cloud storage and sharing workspace for documents, images, and media. Engineered by Chefu Technologies with instant search and OTP security.",
  applicationName: "Cloudence",
  authors: [{ name: "CHEFU TECHNOLOGIES (Pty) Ltd", url: "https://www.chefu.co.za" }],
  creator: "CHEFU TECHNOLOGIES (Pty) Ltd",
  publisher: "CHEFU TECHNOLOGIES (Pty) Ltd",
  keywords: [
    "cloud storage",
    "file workspace",
    "Chefu Technologies",
    "Cloudence",
    "secure file sharing",
    "document management",
    "private cloud drive",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cloudence.chefu.co.za",
    siteName: "Cloudence",
    title: "Cloudence | Focused Cloud Workspace for Your Files",
    description:
      "A clean, dependable cloud storage and sharing workspace for documents, images, and media. Engineered by Chefu Technologies.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloudence | Focused Cloud Workspace",
    description:
      "A clean, dependable cloud storage and sharing workspace for documents, images, and media.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CHEFU TECHNOLOGIES (Pty) Ltd",
  url: "https://www.chefu.co.za",
  logo: "https://cloudence.chefu.co.za/favicon.ico",
  sameAs: ["https://www.chefu.co.za"],
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Cloudence",
  url: "https://cloudence.chefu.co.za",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://cloudence.chefu.co.za/documents?query={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteSchema),
          }}
        />
      </head>
      <body className={`${poppins.variable} font-poppins antialiased`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

