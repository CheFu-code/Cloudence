import React from "react";

export function SecurityArchitecture() {
  const pillars = [
    {
      title: "SSO Unified Identity",
      description:
        "Authentication is delegated to our centralized security infrastructure. Your session is protected by cryptographic cookie signatures and email-verified one-time passwords.",
    },
    {
      title: "Global CDN Asset Pipeline",
      description:
        "High-performance media distribution backed by a global CDN infrastructure. Documents and media files are delivered with optimized compression, fast load times, and high availability.",
    },
    {
      title: "Real-Time Telemetry & Health",
      description:
        "Built-in telemetry continuously monitors system integrity and file upload reliability, automatically detecting network dropouts and upload anomalies 24/7.",
    },
    {
      title: "Zero Ad Tracking or Data Monetization",
      description:
        "Cloudence is a private file utility, not an ad platform. We do not sell metadata, inject tracking cookies, or analyze the contents of your private documents.",
    },
  ];

  return (
    <section id="security" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5 -z-10"
        style={{
          backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
          backgroundSize: '28px 28px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-poppins">
            Built on proven, distributed infrastructure.
          </h2>
          <p className="mt-3 text-base text-slate-400">
            Chefu Technologies maintains high operational standards for Cloudence. Your data is isolated, protected against unauthorized access, and backed by industry-standard cloud providers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="p-7 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-white font-poppins mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Protocol: TLS 1.3 / HTTPS</span>
                <span className="text-emerald-400">Verified System</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
