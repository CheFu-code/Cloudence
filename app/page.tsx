import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cloudence | Simple, secure file storage",
  description: "Store, organize, and share your files with Cloudence by Chefu Technologies.",
};

export default function HomePage() {
  return (
    <main className="public-page">
      <nav className="public-nav">
        <Link href="/" className="public-brand">
          <Image src="/assets/icons/logo-full-brand.svg" alt="Cloudence" width={160} height={50} priority />
        </Link>
        <div className="public-nav-actions">
          <Link href="/privacy" className="public-nav-link">Privacy</Link>
          <Link href="/terms" className="public-nav-link">Terms</Link>
          <Link href="/sign-in" className="public-button public-button-quiet">Sign in</Link>
        </div>
      </nav>

      <section className="public-hero">
        <div className="public-hero-copy">
          <p className="public-eyebrow">CHEFU TECHNOLOGIES</p>
          <h1>Your files, clear and within reach.</h1>
          <p className="public-lead">
            Cloudence gives you a focused place to store, organize, and share the files that matter, without the clutter.
          </p>
          <div className="public-hero-actions">
            <Link href="/sign-up" className="public-button public-button-primary">Create your account</Link>
            <Link href="/sign-in" className="public-text-link">Already have an account <span aria-hidden="true">-&gt;</span></Link>
          </div>
        </div>
        <div className="public-hero-art" aria-hidden="true">
          <Image src="/assets/images/files.png" alt="" width={342} height={342} priority />
          <div className="public-art-note">Organized by you.<br />Ready when you are.</div>
        </div>
      </section>

      <section className="public-features" aria-label="Cloudence features">
        <article><span className="public-feature-number">01</span><h2>One calm workspace</h2><p>Keep documents, images, media, and everything else together in a view that stays easy to scan.</p></article>
        <article><span className="public-feature-number">02</span><h2>Fast file actions</h2><p>Upload, rename, share, download, and remove files without leaving your workspace.</p></article>
        <article><span className="public-feature-number">03</span><h2>Built into CHEFU</h2><p>Use the shared CHEFU account system so your identity and access stay consistent across products.</p></article>
      </section>

      <footer className="public-footer">
        <span>Cloudence by Chefu Technologies</span>
        <div><Link href="/privacy">Privacy Policy</Link><Link href="/terms">Terms of Service</Link></div>
      </footer>
    </main>
  );
}
