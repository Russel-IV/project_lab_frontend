import { SearchForm } from '@/components/SearchForm';
import { Sections, MobileSections } from '../components/Sections';
import PresentationGallery from '../components/PresentationGallery/PresentationGallery';
import { Seo } from '@/lib/seo';
import { SITE_NAME, SITE_URL } from '@/config/seo';

const homeJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/stays?place={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  },
];

export default function Home() {
  return (
    <div className="flex-1 w-full flex flex-col items-center bg-frui-white pb-16 gap-5 sm:gap-10">
      <Seo
        title="Discover Your Next Escape"
        description="Find exclusive deals on hotels, flights, car rentals, things to do, and cruises. Book your next trip with Frui."
        path="/"
        jsonLd={homeJsonLd}
      />

      <div className="w-full md:hidden">
        <MobileSections />
      </div>

      <div className="hidden md:block w-full max-w-[1100px] px-4 sm:px-6 lg:px-8 -mb-10">
        <Sections />
      </div>

      <SearchForm sticky />

      <section className="w-full max-w-[1100px] px-4 sm:px-6 lg:px-8 pb-2 text-left">
        <h1 className="text-4xl sm:text-[52px] font-bold tracking-tight text-[#121324] leading-tight !mb-2">
          Discover your next escape
        </h1>
        <p className="text-base sm:text-lg text-[#5c5d6b] font-normal">
          Find exclusive deals on hotels, flights, and car rentals.
        </p>
      </section>

      <PresentationGallery />
    </div>
  );
}
