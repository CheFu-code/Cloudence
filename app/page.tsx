import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cloudence | Your files, in order",
    description: "A focused workspace for the files you use every day.",
};

export default function HomePage() {
    return (
        <main className="public-page">
            <nav className="public-nav">
                <Link href="/" className="public-brand">
                    Cloudence
                </Link>
                <div className="public-nav-actions">
                    <Link href="/sign-in" className="public-button public-button-quiet">
                        Sign in
                    </Link>
                </div>
            </nav>

            <section className="public-hero">
                <div className="public-hero-copy">
                    <p className="public-eyebrow">A QUIET PLACE FOR BUSY FILES</p>
                    <h1>Everything you keep, right where you left it.</h1>
                    <p className="public-lead">
                        Cloudence is a focused file workspace for documents, images, media,
                        and the everyday things that need a dependable home.
                    </p>
                    <div className="public-hero-actions">
                        <Link
                            href="/sign-up"
                            className="public-button public-button-primary"
                        >
                            Get started <span aria-hidden="true">↗</span>
                        </Link>
                        <Link href="/sign-in" className="public-text-link">
                            Sign in to your workspace <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
                <div
                    className="public-product-preview"
                    aria-label="Preview of the Cloudence workspace"
                >
                    <div className="preview-window-bar">
                        <span />
                        <span />
                        <span />
                        <small>cloudence / workspace</small>
                    </div>
                    <div className="preview-window-body">
                        <aside className="preview-sidebar">
                            <div className="preview-mark">C</div>
                            <span className="preview-sidebar-line active" />
                            <span className="preview-sidebar-line" />
                            <span className="preview-sidebar-line" />
                            <span className="preview-sidebar-line" />
                        </aside>
                        <div className="preview-content">
                            <div className="preview-content-top">
                                <span className="preview-search">Search your files</span>
                                <span className="preview-avatar">K</span>
                            </div>
                            <div className="preview-heading">
                                <div>
                                    <small>YOUR WORKSPACE</small>
                                    <strong>Recent files</strong>
                                </div>
                                <span className="preview-upload">＋ Upload</span>
                            </div>
                            <div className="preview-file-list">
                                <div>
                                    <i className="file-dot doc" />
                                    <span>Project brief.pdf</span>
                                    <small>2.4 MB</small>
                                </div>
                                <div>
                                    <i className="file-dot image" />
                                    <span>Brand references</span>
                                    <small>18 files</small>
                                </div>
                                <div>
                                    <i className="file-dot media" />
                                    <span>Launch film.mp4</span>
                                    <small>84 MB</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="public-strip" aria-label="Cloudence features">
                <div>
                    <span>01</span>
                    <strong>Find it quickly</strong>
                    <p>Search and sort without digging through folders.</p>
                </div>
                <div>
                    <span>02</span>
                    <strong>Keep it together</strong>
                    <p>Documents, images, and media in one workspace.</p>
                </div>
                <div>
                    <span>03</span>
                    <strong>Share deliberately</strong>
                    <p>Give the right people access, when it matters.</p>
                </div>
            </section>

            <footer className="public-footer">
                <span>Cloudence by Chefu Technologies</span>
                <div>
                    <Link href="/privacy">Privacy</Link>
                    <Link href="/terms">Terms</Link>
                </div>
            </footer>
        </main>
    );
}
