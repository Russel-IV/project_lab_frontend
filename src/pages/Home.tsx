import { SearchForm } from '@/components/SearchForm';
import { Sections, MobileSections } from '../components/Sections';
import PresentationGallery from '../components/PresentationGallery/PresentationGallery';
import { Seo } from '@/lib/seo';

export default function Home() {
  return (
    <div className="flex-1 w-full flex flex-col items-center pb-16 gap-10">
      <Seo
        title="Discover Your Next Escape"
        description="Find exclusive deals on hotels, flights, car rentals, things to do, and cruises. Book your next trip with Frui."
        path="/"
      />

      {/* pt-10 gives clearance below the sticky navbar; -mb-6 trims the flex
          column's gap-10 down to a normal gap before the tabs/search form
          below (same negative-margin idiom used for Sections further down). */}
      <section className="w-full max-w-[1100px] px-4 sm:px-6 lg:px-8 pt-10 pb-2 -mb-6 text-left">
        <h1 className="text-4xl sm:text-[52px] font-bold tracking-tight text-[#121324] leading-tight !mb-2">
          Discover your next escape
        </h1>
        <p className="text-base sm:text-lg text-[#5c5d6b] font-normal">
          Find exclusive deals on hotels, flights, and car rentals.
        </p>
      </section>

      <div className="w-full md:hidden">
        <MobileSections />
      </div>

      {/* Categories shown only on desktop, directly above the search form.
          Negative bottom margin cancels the flex column's gap-10 so the tabs
          sit right above the search bar instead of leaving a large gap; the
          search form still needs to stay a direct child of the full-height
          page column below (see its own comment) so this can't be solved by
          nesting them in a shared wrapper instead. */}
      <div className="hidden md:block w-full max-w-[1100px] px-4 sm:px-6 lg:px-8 -mb-10">
        <Sections />
      </div>

      {/* Unified Responsive Search Form: kept as a direct child of the
          full-height page column so its sticky position tracks the whole
          page scroll instead of only the short heading section above. */}
      <SearchForm sticky />

      <PresentationGallery />
    </div>
  );
}
