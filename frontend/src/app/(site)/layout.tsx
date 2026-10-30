import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import JsonLd from "@/components/site/JsonLd";
import { getSettings } from "@/lib/data";
import { siteUrl } from "@/lib/utils";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const url = siteUrl();
  const sameAs = Object.values(s.socials || {}).filter(Boolean);
  const sponsor = s.officialInfo?.find((i) => /sponsor/i.test(i.label))?.value;
  return (
    <>
      <a href="#main" className="sr-only z-[60] rounded-full bg-brand px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <Navbar siteName={s.siteName} shortName={s.shortName} logo={s.logo?.url} />
      <main id="main">{children}</main>
      <Footer s={s} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NGO",
          name: s.siteName,
          alternateName: s.shortName,
          url,
          logo: s.logo?.url || undefined,
          description: s.seo.description,
          slogan: s.motto,
          email: s.contact.email || undefined,
          telephone: s.contact.phone || undefined,
          address: s.contact.address ? { "@type": "PostalAddress", streetAddress: s.contact.address, addressLocality: "Butwal", addressCountry: "NP" } : undefined,
          sameAs: sameAs.length ? sameAs : undefined,
          sponsor: sponsor ? { "@type": "Organization", name: sponsor } : undefined,
          memberOf: { "@type": "Organization", name: "Rotary International", url: "https://www.rotary.org" },
        }}
      />
    </>
  );
}
