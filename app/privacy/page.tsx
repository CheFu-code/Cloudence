import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Cloudence",
  description: "Cloudence privacy policy.",
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <div className="legal-shell">
        <Link href="/" className="legal-back">&lt;- Back to Cloudence</Link>
        <p className="public-eyebrow">LEGAL</p>
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: September 22, 2026</p>
        <div className="legal-content">
          <p>CHEFU TECHNOLOGIES (Pty) Ltd. operates Cloudence. This policy explains how information is handled when you use Cloudence.</p>
          <h2>Information we process</h2>
          <p>We may process your name, email address, account details, authentication events, and files or file metadata that you choose to upload. We also receive technical information such as device, browser, security, and diagnostic data needed to operate and protect the service.</p>
          <h2>How we use information</h2>
          <p>We use this information to provide storage and sharing features, authenticate users through the CHEFU account system, secure the service, respond to support requests, and improve reliability.</p>
          <h2>Service providers</h2>
          <p>Cloudence uses trusted infrastructure providers, including Firebase for account and database services, Cloudinary for file media storage, and Sentry for application error monitoring. These providers process information only as needed to provide their services.</p>
          <h2>Files and account control</h2>
          <p>You control the files you upload and can use the available file actions to rename, share, download, or delete them. Access to Cloudence is tied to your centralized CHEFU account.</p>
          <h2>Contact</h2>
          <p>For privacy questions or requests, contact CHEFU TECHNOLOGIES through <a href="https://www.chefu.co.za">www.chefu.co.za</a>.</p>
        </div>
      </div>
    </main>
  );
}
