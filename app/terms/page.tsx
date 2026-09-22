import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Cloudence",
  description: "Cloudence terms of service.",
};

export default function TermsPage() {
  return (
    <main className="legal-page">
      <div className="legal-shell">
        <Link href="/" className="legal-back">&lt;- Back to Cloudence</Link>
        <p className="public-eyebrow">LEGAL</p>
        <h1>Terms of Service</h1>
        <p className="legal-updated">Last updated: September 22, 2026</p>
        <div className="legal-content">
          <p>These terms govern your use of Cloudence, a file storage and organization service operated by CHEFU TECHNOLOGIES (Pty) Ltd.</p>
          <h2>Using Cloudence</h2>
          <p>You must use Cloudence lawfully and keep your CHEFU account credentials secure. You are responsible for activity performed through your account and for ensuring that content you upload does not violate applicable law or another person’s rights.</p>
          <h2>Your content</h2>
          <p>You retain responsibility for the files you upload. You grant Cloudence the limited permission needed to store, process, display, and deliver those files as part of the service’s features.</p>
          <h2>Sharing and access</h2>
          <p>When you share a file, you are responsible for choosing the recipients and confirming that sharing is appropriate. We may restrict or suspend access when necessary to protect users, the service, or the law.</p>
          <h2>Availability</h2>
          <p>We work to keep Cloudence reliable, but the service may change or become temporarily unavailable for maintenance, security, or circumstances outside our control. Keep separate copies of important content.</p>
          <h2>Contact</h2>
          <p>Questions about these terms can be directed to CHEFU TECHNOLOGIES through <a href="https://www.chefu.co.za?utm_source=cloudence&utm_medium=referral">www.chefu.co.za</a>.</p>
        </div>
      </div>
    </main>
  );
}
