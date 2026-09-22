import React from "react";

export function FeatureHighlights() {
  const features = [
    {
      category: "DISCOVERY",
      title: "Instant Search with Zero Lag",
      description:
        "Locate spreadsheets, high-res photos, or project contracts in milliseconds. Built with responsive client debouncing that queries across titles and extensions without page reloads.",
      points: [
        "Debounced real-time indexing",
        "Search by file extension (e.g. .pdf, .mp4, .png)",
        "Instant filter resets with one click",
      ],
      badgeColor: "bg-teal-50 text-teal-800 border-teal-200",
    },
    {
      category: "ORGANIZATION",
      title: "Category-Based Storage, Not Folder Chaos",
      description:
        "Traditional folder hierarchies end up in forgotten nested chaos. Cloudence automatically classifies every upload into Documents, Images, Media, and Archives with clear capacity indicators.",
      points: [
        "Automatic MIME-type classification",
        "Dedicated views for media, docs, and assets",
        "Storage quotas tracked per category",
      ],
      badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
    },
    {
      category: "COLLABORATION",
      title: "Granular Sharing & Link Controls",
      description:
        "Invite collaborators directly by email or copy protected direct links. Inspect which team members have access to each file and revoke permissions whenever needed.",
      points: [
        "Direct link generation with secure tokens",
        "Collaborator list per individual asset",
        "Instant download and preview access",
      ],
      badgeColor: "bg-indigo-50 text-indigo-800 border-indigo-200",
    },
    {
      category: "SECURITY & AUTH",
      title: "Protected by our SSO Unified Identity",
      description:
        "Tied into our central authentication engine. No vulnerable passwords to reuse or leak: sign in with time-sensitive 6-digit one-time passwords delivered securely to your email.",
      points: [
        "Passwordless 6-digit OTP verification",
        "Single-sign-on across all our services",
        "Secure cookie sessions with HTTP-only tokens",
      ],
      badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
    },
  ];

  return (
    <section id="features" className="py-20 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-poppins">
            Engineered to keep your workday uncluttered.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Cloudence strips away the bloat of traditional enterprise storage tools, focusing exclusively on what matters: fast uploads, reliable storage, and rapid retrieval.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl p-7 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="mb-4">
                  <span className={`text-[11px] font-mono uppercase px-2.5 py-1 rounded-md border font-semibold ${feature.badgeColor}`}>
                    {feature.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-3 font-poppins">
                  {feature.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {feature.description}
                </p>
              </div>

              <div className="pt-5 border-t border-slate-100">
                <ul className="space-y-2.5">
                  {feature.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2.5 text-xs text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
