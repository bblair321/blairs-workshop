export const metadata = {
  title: "Terms of Use",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 prose dark:prose-invert">
      <h1>Terms of Use</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>

      <h2>Unofficial content</h2>
      <p>
        Mods hosted on this site are unofficial and not affiliated with game
        publishers or developers. You install and use mods at your own risk.
      </p>

      <h2>License</h2>
      <p>
        By downloading a mod, you receive a personal, non-transferable license
        to use it. You may not redistribute mod files without permission from
        the creator.
      </p>

      <h2>Paid mods</h2>
      <p>
        Paid mods are licensed to your account after purchase. Refund requests
        within 7 days may be considered if the download fails due to a technical
        issue on our side.
      </p>

      <h2>DMCA</h2>
      <p>
        If you believe content infringes your copyright, contact{" "}
        <a href="mailto:dmca@example.com">dmca@example.com</a> with details.
      </p>
    </div>
  );
}
