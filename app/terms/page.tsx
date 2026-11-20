import type { Metadata } from "next";
import Link from "next/link";
import LegalDocumentPage, {
  type LegalSection,
} from "@/components/legal/LegalDocumentPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the terms for using Cloudence, including account responsibilities, file ownership, sharing, storage limits, and service availability.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Service | Cloudence",
    description:
      "The rules and responsibilities for using the Cloudence file workspace.",
    url: "https://cloudence.chefu.co.za/terms",
    type: "article",
  },
};

const sections: LegalSection[] = [
  {
    id: "agreement-and-operator",
    title: "Agreement and service operator",
    content: (
      <>
        <p>
          These Terms of Service (“Terms”) apply when you access or use
          Cloudence, including its website, web workspace, and mobile apps.
          Cloudence is operated by CHEFU TECHNOLOGIES (Pty) Ltd (“CHEFU”, “we”,
          “us”, or “our”). By creating an account, signing in, or using the
          service, you agree to these Terms. If you do not agree, do not use
          Cloudence.
        </p>
        <p>
          If you use Cloudence for an organization, you confirm that you are
          authorized to accept these Terms for that organization. The
          organization is responsible for its users’ use of the workspace.
        </p>
      </>
    ),
  },
  {
    id: "account",
    title: "Your account and access",
    content: (
      <>
        <p>
          Cloudence uses the central CHEFU account service for sign-in. You must
          provide accurate account details, keep your authentication methods
          private, and promptly tell us if you believe someone has accessed your
          account without permission. You are responsible for activity carried
          out through your account, except to the extent applicable law says
          otherwise.
        </p>
        <p>
          Do not share access to your account credentials. A collaborator
          should access a shared file through their own CHEFU account. We may
          require identity or account verification before restoring access or
          handling sensitive account requests.
        </p>
      </>
    ),
  },
  {
    id: "service-and-limits",
    title: "The service and its limits",
    content: (
      <>
        <p>
          Cloudence provides a workspace to upload, organize, search, preview,
          download, and share supported files. Available features may differ
          between the web and mobile apps. Current upload and storage limits are
          shown in the product; the workspace currently provides up to 2 GB of
          storage per account, subject to the file-specific upload limits shown
          during use.
        </p>
        <p>
          We may add, change, or retire features to maintain or improve the
          service. If we introduce a fee or materially change a paid feature, we
          will present the applicable price and terms before the charge applies.
          These Terms do not create an obligation to offer any particular
          feature indefinitely.
        </p>
      </>
    ),
  },
  {
    id: "your-files",
    title: "Your files and our limited permission",
    content: (
      <>
        <p>
          You keep the rights you hold in the files you upload. You confirm that
          you have the rights and permissions needed to upload, store, and share
          them. You remain responsible for the content and for complying with
          copyright, privacy, confidentiality, and other applicable laws.
        </p>
        <p>
          You give CHEFU a limited, non-exclusive permission to host, store,
          process, secure, display, create previews of, and transmit your files
          solely as needed to operate the features you use, honor your sharing
          choices, protect the service, and provide support. This permission
          also allows our service providers to perform those tasks on our
          behalf. It ends when Cloudence and its providers no longer retain or
          process the relevant content, subject to any continued retention described in the
          <Link href="/privacy"> Privacy Policy</Link> or required by law.
        </p>
        <p>
          Cloudence may reject uploads that exceed product limits, are not a
          supported type, contain certain unsafe content, or create a security
          risk. Some image metadata is removed during upload processing.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Sharing and collaborator access",
    content: (
      <>
        <p>
          You choose whether to share a file and which collaborator email
          addresses to add. You can remove a collaborator and, where available,
          set an expiry date. You are responsible for checking recipient
          addresses and ensuring that sharing is appropriate and lawful.
        </p>
        <p>
          A collaborator may view or download a file while access is active.
          Removing access prevents future access through Cloudence but cannot
          delete copies a recipient already downloaded or saved elsewhere.
          Cloudence may send a collaborator a service notification when access
          is added or removed if that person has enabled notifications.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    content: (
      <>
        <p>You must not use Cloudence to:</p>
        <ul>
          <li>break the law or violate another person’s rights;</li>
          <li>
            upload malicious code, malware, or content intended to compromise
            another person or system;
          </li>
          <li>
            store or distribute content without the rights or consent needed to
            do so;
          </li>
          <li>
            attempt to bypass access controls, quotas, upload checks, or
            security features;
          </li>
          <li>
            interfere with Cloudence, its providers, or another user’s use of
            the service; or
          </li>
          <li>
            use automated means to access the service in a way that creates
            unreasonable load or circumvents rate limits.
          </li>
        </ul>
        <p>
          We may investigate suspected misuse and take proportionate steps to
          protect users, the service, and the public.
        </p>
      </>
    ),
  },
  {
    id: "security-and-availability",
    title: "Security, availability, and your backups",
    content: (
      <>
        <p>
          We use account authorization, controlled file delivery, upload
          validation, and monitoring to help protect Cloudence. No online
          service can promise uninterrupted availability or eliminate every
          security risk. The service may be unavailable for maintenance,
          provider outages, security response, or events beyond our reasonable
          control.
        </p>
        <p>
          Keep separate copies of files that are important to you. Cloudence is
          not a substitute for your own backup or records-management process.
          The mobile app may keep workspace metadata on your device for offline
          use; signing out clears that workspace cache, but does not remove
          files you independently downloaded or exported.
        </p>
      </>
    ),
  },
  {
    id: "deletion-and-closure",
    title: "Deleting files and closing an account",
    content: (
      <>
        <p>
          When you delete a file using the current Cloudence workspace, it is
          removed from your active file list and storage-usage total. The
          current delete action marks the record as deleted but does not itself
          issue a deletion request to the underlying file-storage provider.
          You should not treat the in-app delete action as immediate physical
          erasure of all stored copies. See the
          <Link href="/privacy"> Privacy Policy</Link> for details and how to ask
          about deletion.
        </p>
        <p>
          Closing your Cloudence access is separate from closing your central
          CHEFU account. Contact privacy@chefu.co.za if you want to request
          account closure or information deletion. Information may be retained
          where necessary or permitted by law, for security, or to resolve a
          dispute.
        </p>
      </>
    ),
  },
  {
    id: "suspension",
    title: "Suspension and termination",
    content: (
      <>
        <p>
          You may stop using Cloudence at any time. We may limit or suspend
          access if reasonably necessary to address a security risk, suspected
          unlawful or harmful activity, a breach of these Terms, a legal
          requirement, or a material risk to Cloudence or another user. Where
          reasonably possible, we will provide notice and an opportunity to
          address the issue. We may act without advance notice where urgent
          action is needed to protect people, data, or the service.
        </p>
        <p>
          If Cloudence is discontinued, we will provide notice or a reasonable
          opportunity to retrieve content where feasible and legally permitted.
          This does not apply where immediate removal or restriction is
          necessary for security or legal reasons.
        </p>
      </>
    ),
  },
  {
    id: "providers-and-links",
    title: "Third-party services and links",
    content: (
      <p>
        Cloudence relies on providers for account, hosting, storage, diagnostics,
        analytics, and mobile push services. Their services may be subject to
        their own terms and privacy notices. We are not responsible for external
        websites or services that CHEFU does not control. Our
        <Link href="/privacy"> Privacy Policy</Link> describes the providers used by
        Cloudence and the information involved.
      </p>
    ),
  },
  {
    id: "intellectual-property",
    title: "Cloudence intellectual property",
    content: (
      <p>
        CHEFU and its licensors retain their rights in Cloudence, including its
        software, design, branding, and documentation. These Terms give you a
        personal, limited, non-transferable right to use Cloudence for its
        intended purpose while you comply with these Terms. You may not copy,
        modify, reverse engineer, resell, or redistribute the service except
        where applicable law permits or we give written permission. If you send
        product suggestions, you allow us to use them without restriction or
        payment, but this does not transfer ownership of your files or other
        intellectual property.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Responsibility and liability",
    content: (
      <>
        <p>
          To the extent permitted by law, you are responsible for losses caused
          by your unlawful use of Cloudence or your breach of these Terms. CHEFU
          is responsible for providing Cloudence with reasonable care and skill
          and for obligations that cannot lawfully be excluded or limited.
        </p>
        <p>
          Nothing in these Terms excludes, restricts, or changes a right or
          remedy that cannot be excluded, restricted, or changed under
          applicable law, including mandatory consumer protections. Subject to
          that rule, neither party is liable to the other for indirect or
          consequential loss that was not reasonably foreseeable. These limits
          do not apply where they are prohibited by law, including for fraud or
          intentional misconduct.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to these Terms",
    content: (
      <p>
        We may update these Terms when Cloudence, our services, or applicable
        law changes. We will update the date on this page and provide additional
        notice where required. If a change materially affects your rights or
        obligations, we will take any notice or consent steps required by law.
        If you do not agree to an updated version, stop using Cloudence and
        contact us about your account and files.
      </p>
    ),
  },
  {
    id: "law-and-contact",
    title: "Governing law and contact",
    content: (
      <>
        <p>
          These Terms are governed by the laws of South Africa, subject to any
          mandatory consumer or other legal protections that apply to you. Any
          dispute may be brought before a court with jurisdiction, without
          taking away a right that applicable law gives you to use another
          forum.
        </p>
        <p>
          CHEFU TECHNOLOGIES (Pty) Ltd operates Cloudence. For questions about
          these Terms, email <a href="mailto:hello@chefu.co.za">hello@chefu.co.za</a>.
          For privacy and data requests, email{" "}
          <a href="mailto:privacy@chefu.co.za">privacy@chefu.co.za</a>.
        </p>
        <p>
          These Terms should be read together with our
          <Link href="/privacy"> Privacy Policy</Link> and the applicable terms of
          your CHEFU account.
        </p>
        <p>
          South African legislation referenced by these Terms includes the
          <a
            href="https://www.gov.za/documents/electronic-communications-and-transactions-act"
            target="_blank"
            rel="noreferrer"
          >
            Electronic Communications and Transactions Act
          </a>
          , the
          <a
            href="https://www.gov.za/sites/default/files/32186_467.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Consumer Protection Act
          </a>
          , and other laws that apply to the parties and service.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalDocumentPage
      title="Terms of Service"
      description="The shared expectations that make Cloudence useful, respectful, and secure for everyone using the workspace."
      summary="Use Cloudence lawfully, protect your account, share files carefully, and keep your own backup of important content. Your rights under applicable law remain in place."
      updated="20 November 2026"
      sections={sections}
      otherDocument={{ href: "/privacy", label: "Privacy Policy" }}
    />
  );
}
