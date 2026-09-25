import React from "react";

export function SecurityArchitecture() {
  const pillars = [
    {
      title: "Automatic EXIF & Location Scrubbing",
      badge: "Privacy Defense",
      description:
        "Photos taken on smartphones and digital cameras embed sensitive GPS coordinates and camera hardware serial numbers. Cloudence automatically strips all EXIF metadata on upload, ensuring your home, work, and physical location can never be extracted from shared images.",
      protocol: "Metadata Scrub: GPS / Hardware Stripped",
    },
    {
      title: "Real-Time DLP & Secret Protection",
      badge: "Data Loss Prevention",
      description:
        "Pre-upload heuristic inspection blocks accidental leaks of plain-text private keys (RSA/SSH/EC), AWS access keys, GitHub tokens, and AI service API keys before files ever touch cloud storage.",
      protocol: "DLP Engine: Active Credential Shield",
    },
    {
      title: "Anti-Malware & Magic-Byte Inspection",
      badge: "Binary Defense",
      description:
        "Deep binary analysis inspects file headers to block disguised executables (Windows PE, Linux ELF, Mach-O, shebang scripts) even if renamed to .jpg or .pdf. Vector SVGs are sanitized against stored XSS.",
      protocol: "Signature Check: PE / ELF / XSS Guard",
    },
    {
      title: "Authorized Ephemeral Delivery & Expiring Links",
      badge: "Access Control",
      description:
        "Downloads and previews are served via short-lived, cryptographically signed delivery URLs. File sharing supports automatic time-to-live (TTL) expiration, and revoking access immediately cuts off file delivery.",
      protocol: "Delivery: Ephemeral Signed Tokens",
    },
    {
      title: "Unified Identity & Anti-Abuse Throttling",
      badge: "Identity & Rate Limiting",
      description:
        "Authentication is secured by centralized SSO infrastructure with cryptographic session cookies, email-verified OTPs, and intelligent rate limiting to block brute-force attacks and abuse.",
      protocol: "Auth: TLS 1.3 / Signed Session Cookies",
    },
    {
      title: "Zero Ad Tracking or Data Monetization",
      badge: "Confidentiality",
      description:
        "Cloudence is a private workspace, not an ad platform. We do not monetize data, sell metadata, or inspect private file contents for commercial profiling. Your files belong entirely to you.",
      protocol: "Telemetry: Privacy-First / Zero Ads",
    },
  ];

  return (
    <section id="security" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5 -z-10"
        style={{
          backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-poppins">
            Engineered to keep your files and your identity safe.
          </h2>
          <p className="mt-3 text-base text-slate-400">
            Chefu Technologies maintains high operational and cryptographic standards for Cloudence. From stripping GPS location tags on phone photos to blocking disguised executables and credential leaks, your data is defended by default.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="p-7 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-semibold tracking-wider uppercase text-teal-400">
                  {pillar.badge}
                </span>
                <h3 className="text-lg font-bold text-white font-poppins mt-1 mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="truncate pr-2">{pillar.protocol}</span>
                <span className="text-emerald-400 shrink-0">Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
