import Link from "next/link";
import {
  getContactEmail,
  getSiteUrl,
  LEGAL_LAST_UPDATED,
  SITE_NAME,
} from "@/lib/site";

export const metadata = {
  title: "Terms of Use",
  description: `Terms of use for ${SITE_NAME}.`,
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

export default function TermsPage() {
  const siteUrl = getSiteUrl();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 prose dark:prose-invert">
      <h1>Terms of Use</h1>
      <p className="lead">
        These terms govern your use of {SITE_NAME} ({siteUrl}). By using this
        site, you agree to them.
      </p>
      <p>
        <strong>Last updated:</strong> {LEGAL_LAST_UPDATED}
      </p>

      <h2>1. About this site</h2>
      <p>
        {SITE_NAME} is a personal site where I publish PC game mods, FiveM scripts,
        and related modding tools. I operate this site as an individual, not as a
        game publisher or platform.
      </p>

      <h2>2. Unofficial content</h2>
      <p>
        Unless stated otherwise, mods and tools on this site are{" "}
        <strong>unofficial</strong> and are not affiliated with, endorsed by, or
        sponsored by any game developer or publisher. You install and use downloads
        at your own risk.
      </p>
      <p>I am not responsible for:</p>
      <ul>
        <li>Game crashes, bugs, or performance issues</li>
        <li>Save file corruption or data loss</li>
        <li>Account bans or penalties imposed by game services</li>
        <li>Damage to your computer or software</li>
        <li>Conflicts with other mods or third-party software</li>
      </ul>
      <p>
        Always back up your saves before installing mods. Read each mod&apos;s
        install instructions and system requirements.
      </p>

      <h2>3. Accounts</h2>
      <p>
        Some features (such as purchasing paid mods or accessing your library)
        require an account. You are responsible for keeping your login
        credentials secure and for activity under your account.
      </p>
      <p>
        You must provide accurate information when registering and must be at
        least 13 years old (or the minimum age required in your country) to create
        an account.
      </p>

      <h2>4. Downloads and license</h2>
      <p>
        When you download a mod from this site, you receive a personal,
        non-exclusive, non-transferable license to use it for your own gameplay or
        modding purposes. Unless I state otherwise:
      </p>
      <ul>
        <li>You may not redistribute, resell, or publicly re-host mod files</li>
        <li>You may not claim the work as your own</li>
        <li>You may not use downloads to develop competing paid products</li>
      </ul>
      <p>
        Third-party assets inside a mod may have separate licenses described on the
        mod page.
      </p>

      <h2>5. Paid mods and refunds</h2>
      <p>
        Some mods may be offered for purchase. Paid mods are licensed to the
        account that completed the purchase. Prices are shown in USD unless noted
        otherwise.
      </p>
      <p>
        Payments are processed by Stripe. I do not store full payment card details
        on my servers. Refund requests within 7 days of purchase may be considered
        if a download fails due to a technical problem on my side. Refunds are not
        guaranteed for compatibility issues, buyer&apos;s remorse, or problems
        caused by your game setup.
      </p>
      <p>
        To request a refund, contact <ContactLink subject="Refund request" /> with
        your account email and the mod name.
      </p>

      <h2>6. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Attempt to break, scrape, or overload the site or its APIs</li>
        <li>Bypass download limits, access controls, or payment requirements</li>
        <li>Upload malware or misrepresent file contents</li>
        <li>Use the site for unlawful purposes</li>
      </ul>

      <h2 id="dmca">7. Copyright and DMCA takedowns</h2>
      <p>
        I respect intellectual property rights. If you believe content on this site
        infringes your copyright, send a DMCA notice to{" "}
        <ContactLink subject="DMCA takedown notice" />.
      </p>
      <p>Your notice should include:</p>
      <ol>
        <li>Your name and contact information (address, phone, and email)</li>
        <li>
          Identification of the copyrighted work you believe was infringed
        </li>
        <li>
          The URL or mod name on {SITE_NAME} where the material appears
        </li>
        <li>
          A statement that you have a good-faith belief the use is not authorized
        </li>
        <li>
          A statement, under penalty of perjury, that the information in your
          notice is accurate and that you are the rights holder or authorized to
          act on their behalf
        </li>
        <li>Your physical or electronic signature</li>
      </ol>
      <p>
        I may remove or disable access to material after receiving a valid notice.
        Repeat infringers may have access terminated where applicable.
      </p>

      <h2>8. Disclaimer of warranties</h2>
      <p>
        This site and all downloads are provided &ldquo;as is&rdquo; and &ldquo;as
        available&rdquo; without warranties of any kind, express or implied,
        including fitness for a particular purpose, merchantability, and
        non-infringement.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, I am not liable for any indirect,
        incidental, special, consequential, or punitive damages, or for any loss of
        profits, data, or goodwill, arising from your use of this site or any
        download. My total liability for any claim related to the site is limited
        to the amount you paid me for the specific mod giving rise to the claim in
        the 12 months before the claim, or $50 USD if you paid nothing.
      </p>

      <h2>10. Changes</h2>
      <p>
        I may update these terms from time to time. The &ldquo;Last updated&rdquo;
        date at the top will change when I do. Continued use of the site after
        changes means you accept the updated terms.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions about these terms: <ContactLink subject="Terms of Use question" />
        . See also our <Link href="/privacy">Privacy Policy</Link>.
      </p>
    </div>
  );
}
