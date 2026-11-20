import type { Metadata } from "next";
import LegalDocumentPage, {
  type LegalSection,
} from "@/components/legal/LegalDocumentPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn what personal information Cloudence processes, why it is used, which service providers support the workspace, and how to make a privacy request.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | Cloudence",
    description:
      "A clear guide to Cloudence account, file, device, and diagnostic data.",
    url: "https://cloudence.chefu.co.za/privacy",
    type: "article",
  },
};

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are and who this policy covers",
    content: (
      <>
        <p>
          Cloudence is a file storage and sharing workspace operated by CHEFU
          TECHNOLOGIES (Pty) Ltd (“CHEFU”, “we”, “us”, or “our”). For
          personal information processed to run Cloudence, CHEFU is the
          responsible party under South Africa’s Protection of Personal
          Information Act (POPIA), subject to the role we have for a particular
          activity.
        </p>
        <p>
          This policy covers the Cloudence website, web workspace, and mobile
          apps. It does not replace the privacy notices or terms of the central
          CHEFU account service or third-party services that you choose to use.
        </p>
      </>
    ),
  },
  {
    id: "information-we-handle",
    title: "Information we handle",
    content: (
      <>
        <p>Depending on how you use Cloudence, we may process:</p>
        <ul>
          <li>
            <strong>Account information:</strong> your account identifier, name,
            email address, and profile image supplied by your CHEFU account.
          </li>
          <li>
            <strong>Workspace information:</strong> file names, file type and
            size, folder placement, timestamps, storage usage, and a checksum
            used to verify file integrity.
          </li>
          <li>
            <strong>Files you provide:</strong> the file contents you upload,
            plus the information needed to store, preview, organize, and deliver
            them to you.
          </li>
          <li>
            <strong>Sharing information:</strong> collaborator email addresses,
            sharing changes, and any expiry date you set for shared access.
          </li>
          <li>
            <strong>Service and security records:</strong> actions such as
            uploads, downloads, renames, shares, removals, sign-in and session
            events, and technical details needed to investigate errors, abuse,
            or security incidents.
          </li>
          <li>
            <strong>Device and app information:</strong> browser or device type,
            operating system, app version, diagnostic events, and performance
            information generated when you use the service.
          </li>
          <li>
            <strong>Push notification information:</strong> if you enable mobile
            alerts, the push token for your device, its platform, your alert
            preferences, and the notification event needed to deliver an alert.
          </li>
        </ul>
        <p>
          Please do not upload information you do not have the right to store or
          share. You decide what files and personal information to put in your
          workspace.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-it",
    title: "Why we use this information",
    content: (
      <>
        <p>We use information where needed to:</p>
        <ul>
          <li>create and secure your workspace through your CHEFU account;</li>
          <li>store, organize, search, preview, download, and share your files;</li>
          <li>calculate storage usage and enforce upload and storage limits;</li>
          <li>apply your sharing choices and expiry dates;</li>
          <li>send alerts you enabled, including quota and collaborator updates;</li>
          <li>answer support requests and communicate service changes;</li>
          <li>detect abuse, protect accounts, and investigate security events;</li>
          <li>diagnose errors and improve service performance; and</li>
          <li>meet legal, regulatory, and record-keeping obligations.</li>
        </ul>
        <p>
          Depending on the activity, processing is necessary to provide the
          service you request, meet a legal obligation, protect legitimate
          service and security interests, or is based on your consent where
          consent is required. You can turn off mobile push alerts in your
          device settings; doing so does not disable essential account or
          security messages from the CHEFU account service.
        </p>
      </>
    ),
  },
  {
    id: "file-processing",
    title: "How uploaded files are processed",
    content: (
      <>
        <p>
          Cloudence processes files to provide storage, previews, organization,
          and downloads. Uploads are checked for supported file types and
          certain unsafe content. For some text-based files, Cloudence scans a
          limited portion of the file for known credential patterns to help
          prevent accidental exposure. SVG files are sanitized before storage.
          Image profile metadata, including EXIF information such as GPS
          coordinates where present, is stripped during upload processing.
        </p>
        <p>
          File content is not public by default. File content requests are
          checked against your account and the file’s sharing permissions before
          Cloudence returns content. We do not sell your files or use them to
          select advertising for you.
        </p>
        <p>
          A checksum and basic file metadata may be kept separately from the
          file content to support integrity checks, storage accounting, and
          security records.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Sharing and collaborators",
    content: (
      <>
        <p>
          When you add collaborators, we process the email addresses you enter
          and the access changes you make. A collaborator must use the
          corresponding CHEFU account to access a file. The file owner can
          remove a collaborator and can set an expiry date for shared access.
        </p>
        <p>
          Share only with people who should receive the file. A collaborator may
          view or download content while access is active. Removing access
          prevents future Cloudence access but cannot recall copies a recipient
          has already downloaded or saved outside Cloudence.
        </p>
      </>
    ),
  },
  {
    id: "cookies-and-local-storage",
    title: "Cookies and on-device storage",
    content: (
      <>
        <p>
          The web workspace uses session cookies from the CHEFU account service
          to keep you signed in and protect account requests. These cookies are
          configured as HTTP-only and, in production, secure. The public site
          and workspace also use Vercel Analytics and Speed Insights for website
          usage and performance measurement.
        </p>
        <p>
          The Cloudence website uses Sentry for error monitoring and may record
          sampled session replays, including additional sessions where an error
          occurs, to diagnose failures. Replay is configured to mask page text
          and input values and block media. Diagnostic events may still include
          technical context such as the page route, browser, and error details.
        </p>
        <p>
          The mobile app stores workspace metadata, such as file listings,
          folders, and usage totals, in an on-device cache so the workspace can
          open faster and remain useful offline. It also stores your view and
          alert preferences. File previews use a temporary in-memory cache.
          Signing out clears the workspace metadata cache for that account.
          Files you download or export are saved wherever you choose through
          your device’s operating system.
        </p>
      </>
    ),
  },
  {
    id: "notifications",
    title: "Mobile push notifications",
    content: (
      <>
        <p>
          If you grant notification permission, Cloudence stores your Expo push
          token and device platform so it can deliver alerts. You can turn
          storage quota alerts and collaborator activity alerts on or off in
          notification settings. Current alerts include storage reaching 80%
          usage and a collaborator being given or removed from a shared file.
        </p>
        <p>
          Notification delivery uses Expo’s push service and the notification
          services provided by your device platform, such as Google or Apple.
          A notification may display the storage percentage or shared file name
          on your lock screen according to your device settings. You can disable
          permission through the operating system at any time; Cloudence may
          retain the device token until you sign out or the device registration
          is removed.
        </p>
      </>
    ),
  },
  {
    id: "service-providers",
    title: "Service providers and disclosures",
    content: (
      <>
        <p>
          We use service providers to operate Cloudence. These currently
          include Firebase for account and database infrastructure, Cloudinary
          for file storage and media processing, Vercel for website hosting,
          analytics and performance measurements, Sentry for diagnostics, and
          Expo plus Apple or Google for mobile push delivery. CHEFU’s central
          account service also handles sign-in and account security.
        </p>
        <p>
          Providers process information on our behalf to deliver their
          services. We may also disclose information when necessary to comply
          with law, respond to valid legal process, protect users or Cloudence,
          or investigate suspected fraud, abuse, or security incidents. We do
          not sell personal information.
        </p>
        <p>
          These providers may process information in countries other than the
          country where you live. Where a cross-border transfer is subject to
          POPIA or another applicable law, we take the steps that law requires
          for the transfer.
        </p>
      </>
    ),
  },
  {
    id: "retention-and-deletion",
    title: "Retention, deletion, and account closure",
    content: (
      <>
        <p>
          We keep information for as long as it is needed to provide Cloudence,
          maintain account and security records, resolve disputes, and meet
          legal obligations. Retention periods can differ by information type
          and provider. We do not publish a fixed deletion period for every
          record.
        </p>
        <p>
          Deleting a file in the current Cloudence workspace removes it from
          your active file list and storage-usage total. The current delete
          workflow marks the file record as deleted and does not itself issue a
          deletion request to the underlying file-storage provider. Therefore,
          deleting a file in the app should not be treated as immediate physical
          erasure of every stored copy. Contact privacy@chefu.co.za to request
          information about a specific deletion or to make a personal
          information deletion request.
        </p>
        <p>
          Closing access to Cloudence is separate from closing your central
          CHEFU account. Contact us if you want to request account closure or
          deletion. We may retain limited records where the law allows or
          requires us to do so.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "Security and incident response",
    content: (
      <>
        <p>
          We use measures designed to protect information, including
          account-based authorization for file access, controlled sharing,
          protected file delivery, upload validation, and security monitoring.
          No internet service or storage method can be guaranteed completely
          secure. Keep your account credentials private and tell us promptly if
          you suspect unauthorized access.
        </p>
        <p>
          If a security compromise involving personal information occurs, we
          will assess and respond to it and provide notices required by
          applicable law.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your privacy rights and choices",
    content: (
      <>
        <p>
          Subject to applicable law, you may ask us to confirm whether we hold
          personal information about you, access it, correct inaccurate
          information, or delete information that we are no longer authorized
          to retain. You may also object to or ask us to restrict certain
          processing where the law provides that right, and withdraw consent
          where processing is based on consent. We may need to verify your
          identity and may have to retain some records for legal or security
          reasons.
        </p>
        <p>
          Email <a href="mailto:privacy@chefu.co.za">privacy@chefu.co.za</a> to
          exercise a right or ask a question. You may also contact the South
          African <a href="https://inforegulator.org.za/" target="_blank" rel="noreferrer">Information Regulator</a> or use its
          <a href="https://inforegulator.org.za/complaints/" target="_blank" rel="noreferrer"> complaint process</a>.
        </p>
        <p>
          This policy is intended to describe our processing in line with POPIA
          and other applicable privacy laws; it does not limit rights provided
          by those laws. You can read the
          <a
            href="https://www.justice.gov.za/legislation/acts/2013-004.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Protection of Personal Information Act
          </a>
          and view the Information Regulator’s request and complaint guidance
          through the links above.
        </p>
      </>
    ),
  },
  {
    id: "policy-changes",
    title: "Changes to this policy",
    content: (
      <p>
        We may update this policy as Cloudence, our providers, or applicable
        law changes. We will update the effective date on this page and provide
        any additional notice required by law. Material changes will be
        communicated through Cloudence or another appropriate channel where
        required.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalDocumentPage
      title="Privacy Policy"
      description="A practical guide to the information Cloudence uses to provide your workspace, keep it secure, and respect your choices."
      summary="You choose the files you store and the people you share them with. We process the information needed to run Cloudence, secure accounts, and deliver the features you enable."
      updated="20 November 2026"
      sections={sections}
      otherDocument={{ href: "/terms", label: "Terms of Service" }}
    />
  );
}
