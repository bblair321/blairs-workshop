import { getContactEmail } from "@/lib/site";

export const metadata = {
  title: "Terms of Use",
};

const LAST_UPDATED = "July 9, 2026";

export default function TermsPage() {
  const contactEmail = getContactEmail();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 prose dark:prose-invert">
      <h1>Terms of Use</h1>
      <p>Last updated: {LAST_UPDATED}</p>

      <h2>Unofficial content</h2>
      <p>
        Mods on Blair&apos;s Workshop are unofficial and not affiliated with game
        publishers or developers. You install and use mods at your own risk. I am
        not responsible for game crashes, save corruption, bans, or other issues
        caused by installing mods.
      </p>

      <h2>License</h2>
      <p>
        By downloading a mod, you receive a personal, non-transferable license to
        use it. You may not redistribute mod files without my permission.
      </p>

      <h2>Paid mods</h2>
      <p>
        If paid mods are offered, they are licensed to your account after
        purchase. Refund requests within 7 days may be considered if the download
        fails due to a technical issue on my side.
      </p>

      <h2>Copyright / takedowns</h2>
      <p>
        If you believe content on this site infringes your copyright,{" "}
        {contactEmail ? (
          <>
            contact{" "}
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a> with details.
          </>
        ) : (
          <>contact me using the email listed on this site with details.</>
        )}
      </p>
    </div>
  );
}
