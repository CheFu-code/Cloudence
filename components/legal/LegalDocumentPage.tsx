import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ShieldCheck } from "lucide-react";

export type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

type Props = {
  title: string;
  description: string;
  summary: string;
  updated: string;
  sections: LegalSection[];
  otherDocument: { href: string; label: string };
};

export default function LegalDocumentPage({
  title,
  description,
  summary,
  updated,
  sections,
  otherDocument,
}: Props) {
  return (
    <main className="legal-page">
      <header className="legal-header">
        <nav className="legal-nav" aria-label="Main navigation">
          <Link href="/" className="legal-brand" aria-label="Cloudence home">
            <span className="legal-brand-mark" aria-hidden="true">
              <span />
              <span />
            </span>
            <span>Cloudence</span>
          </Link>
          <Link href="/" className="legal-home-link">
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Back to Cloudence</span>
          </Link>
        </nav>

        <div className="legal-hero">
          <div className="legal-hero-copy">
            <p className="legal-eyebrow">
              <ShieldCheck size={15} aria-hidden="true" />
              Trust and governance
            </p>
            <h1>{title}</h1>
            <p className="legal-description">{description}</p>
            <div className="legal-meta">
              <span>Effective date: {updated}</span>
              <span className="legal-meta-dot" aria-hidden="true" />
              <span>Cloudence web and mobile apps</span>
            </div>
          </div>
          <div className="legal-hero-card">
            <span className="legal-hero-card-label">The short version</span>
            <p>{summary}</p>
            <span className="legal-hero-card-company">
              CHEFU TECHNOLOGIES (Pty) Ltd
            </span>
          </div>
        </div>
      </header>

      <div className="legal-document-layout">
        <aside className="legal-sidebar">
          <p className="legal-sidebar-title">On this page</p>
          <nav aria-label={`${title} sections`}>
            <ol>
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <Link href={otherDocument.href} className="legal-sidebar-related">
            Read {otherDocument.label}
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </aside>

        <article className="legal-article">
          <div className="legal-article-intro">
            <p>
              This document explains how Cloudence works and what you can
              expect when you use it. Please read it carefully and contact us
              if anything is unclear.
            </p>
          </div>
          {sections.map((section, index) => (
            <section
              className="legal-section"
              id={section.id}
              key={section.id}
              aria-labelledby={`${section.id}-title`}
            >
              <span className="legal-section-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="legal-section-body">
                <h2 id={`${section.id}-title`}>{section.title}</h2>
                <div className="legal-prose">{section.content}</div>
              </div>
            </section>
          ))}

          <div className="legal-contact-card">
            <div>
              <span className="legal-contact-eyebrow">Need help?</span>
              <h2>Talk to the Cloudence team</h2>
              <p>
                Send questions or requests about this document to our privacy
                contact. We may verify your identity before discussing account
                information.
              </p>
            </div>
            <a href="mailto:privacy@chefu.co.za" className="legal-contact-button">
              privacy@chefu.co.za
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>

          <footer className="legal-footer">
            <span>© {new Date().getFullYear()} CHEFU TECHNOLOGIES (Pty) Ltd</span>
            <Link href="/">Return to Cloudence</Link>
          </footer>
        </article>
      </div>
    </main>
  );
}
