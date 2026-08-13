import { SearchForm } from '@/components/SearchForm';
import { Sections, MobileSections } from '../components/Sections';
import PopularDestinations from '../components/PopularDestinations';
import FeaturedStays from '../components/FeaturedStays';
import { Seo } from '@/lib/seo';
import { SITE_NAME, SITE_URL } from '@/config/seo';
import airplaneFlying from '@/assets/airplane-flying.jpeg';

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

      <div className="relative isolate w-full flex flex-col items-center gap-4 sm:gap-6 pt-4 sm:pt-6 pb-10 sm:pb-14 lg:pb-16">
        <img
          src={airplaneFlying}
          alt="Airplane flying above the clouds"
          className="absolute inset-0 -z-20 w-full h-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black/60 via-black/30 to-black/10" />

        <div className="w-full md:hidden">
          <MobileSections />
        </div>

        <div className="hidden md:block w-full max-w-[1100px] px-4 sm:px-6 lg:px-8">
          <Sections />
        </div>

        <div className="w-full max-w-[1100px] px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
          <div className="w-full lg:w-[860px] lg:mx-auto [&_.form-card]:bg-white! [&_.form-card]:backdrop-blur-none!">
            <SearchForm />
          </div>

          <div className="max-w-lg text-left">
            <h1 className="text-4xl sm:text-[52px] font-bold tracking-tight text-white leading-tight !mb-2 drop-shadow-md">
              Discover your next escape
            </h1>
            <p className="text-base sm:text-lg text-white/90 font-normal drop-shadow-sm">
              Find exclusive deals on hotels, flights, and car rentals.
            </p>
          </div>
        </div>
      </div>

      <PopularDestinations />

      {/*<PresentationGallery />*/}

      <FeaturedStays />
    </div>
  );
}
