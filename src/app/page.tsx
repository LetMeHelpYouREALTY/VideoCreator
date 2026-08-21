import { VideoStudio } from "@/components/studio/VideoStudio";
import { SITE } from "@/lib/constants";

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: SITE.agentName,
  legalName: SITE.businessName,
  telephone: SITE.phone,
  areaServed: `${SITE.city}, ${SITE.region}`,
  url: SITE.url,
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <VideoStudio />
    </>
  );
}
