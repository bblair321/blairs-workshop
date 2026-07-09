import Link from "next/link";
import {
  getContactEmail,
  getSiteUrl,
  LEGAL_LAST_UPDATED,
  SITE_NAME,
} from "@/lib/site";

export const metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE_NAME}.`,
};

function ContactLink({ subject }: { subject?: string }) {
  const email = getContactEmail();
  if (!email) {
    return <>the contact email listed on this site</>;
  }

  const href = subject
    ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${email}`;

  return (
    <a href={href} className="text-violet-600 hover:underline dark:text-violet-400">
      {email}
    </a>
  );
}

export default function PrivacyPage() {
  const siteUrl = getSiteUrl();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 prose dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p className="lead">
        This policy explains how {SITE_NAME} ({siteUrl}) collects, uses, and
        protects information when you visit the site or create an account.
      </p>
      <p>
        <strong>Last updated:</strong> {LEGAL_LAST_UPDATED}
      </p>

      <h2>1. Who operates this site</h2>
      <p>
        {SITE_NAME} is operated by Blair as an individual mod author and
        distributor. For privacy questions, contact{" "}
        <ContactLink subject="Privacy request" />.
      </p>

      <h2>2. Information we collect</h2>
      <h3>Account information</h3>
      <p>
        If you register, we store your email address, optional display name, and a
        hashed password. We use this to authenticate you and manage purchases and
        your library.
      </p>
      <h3>Download activity</h3>
      <p>
        When you download a mod, we may log the mod version, a hashed form of your
        IP address, browser user-agent string, and your user ID if you are signed
        in. This helps with abuse prevention and basic analytics.
      </p>
      <h3>Purchase information</h3>
      <p>
        If you buy a paid mod, Stripe processes payment. We receive confirmation
        of the purchase, amount, and a payment reference — not your full card
        number. Stripe&apos;s privacy policy applies to payment data they handle.
      </p>
      <h3>Technical data</h3>
      <p>
        Like most websites, our hosting provider may log standard request data
        (IP address, pages visited, timestamps) for security and operations.
      </p>

      <h2>3. How we use information</h2>
      <p>We use collected information to:</p>
      <ul>
        <li>Provide downloads and account features</li>
        <li>Process purchases and show your library</li>
        <li>Prevent abuse and enforce rate limits</li>
        <li>Respond to support, refund, or legal requests</li>
        <li>Maintain and improve the site</li>
      </ul>
      <p>We do not sell your personal information.</p>

      <h2>4. Cookies and sessions</h2>
      <p>
        We use essential cookies and similar technologies to keep you signed in
        (via NextAuth session cookies) and to protect the admin area. These are
        required for authentication and are not used for third-party advertising.
      </p>

      <h2>5. Third-party services</h2>
      <p>We rely on service providers that may process data on our behalf:</p>
      <ul>
        <li>
          <strong>Stripe</strong> — payment processing for paid mods
        </li>
        <li>
          <strong>Cloudflare R2</strong> — private storage of mod files
        </li>
        <li>
          <strong>Hosting provider (e.g. Vercel)</strong> — serves the website
        </li>
        <li>
          <strong>Database provider (e.g. Neon)</strong> — stores account and mod
          metadata
        </li>
      </ul>
      <p>
        Each provider has its own privacy and security practices. We only share
        what is needed for them to perform their services.
      </p>

      <h2>6. Data retention</h2>
      <p>
        Account data is kept while your account is active. Download logs may be
        retained for a reasonable period for security and troubleshooting.
        Purchase records may be kept longer where required for tax, accounting, or
        legal purposes.
      </p>

      <h2>7. Your choices</h2>
      <p>
        You may request access to or deletion of your account data by contacting{" "}
        <ContactLink subject="Account data request" />. Deleting your account may
        remove access to purchased mods where license records are tied to your
        account.
      </p>
      <p>
        You can use most free mods without an account. Paid mods and library
        features require registration.
      </p>

      <h2>8. Children</h2>
      <p>
        This site is not directed at children under 13. We do not knowingly collect
        personal information from children under 13. If you believe a child has
        provided us information, contact us and we will delete it.
      </p>

      <h2>9. Security</h2>
      <p>
        We use industry-standard measures such as HTTPS, hashed passwords, and
        private file storage with signed download links. No method of transmission
        or storage is 100% secure.
      </p>

      <h2>10. International visitors</h2>
      <p>
        If you access the site from outside the United States, your information may
        be processed in the U.S. or where our service providers operate.
      </p>

      <h2>11. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The &ldquo;Last
        updated&rdquo; date will reflect changes. Material updates may be noted on
        the site.
      </p>

      <h2>12. Contact</h2>
      <p>
        Privacy questions or requests: <ContactLink subject="Privacy request" />.
        Copyright concerns: see our{" "}
        <Link href="/terms#dmca">DMCA procedure</Link> on the Terms page.
      </p>
    </div>
  );
}
