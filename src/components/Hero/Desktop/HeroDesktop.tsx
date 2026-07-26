import React from 'react';
import { Sections } from '@/components/Sections';
import { SearchFormDesktop } from '@/components/SearchForm';
import { ParallaxScene } from './ParallaxScene';

export const HeroDesktop: React.FC = () => {
  return (
    <section className="w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-10 pb-6">
      <div className="grid grid-cols-2 gap-16 items-start">
        <div className="flex flex-col gap-2 text-left">
          <h1 className="text-4xl sm:text-[52px] font-bold tracking-tight text-[#121324] leading-tight">
            Discover your next escape
          </h1>
          <p className="text-base sm:text-lg text-[#5c5d6b] font-normal mb-4">
            Find exclusive deals on hotels, flights, and car rentals.
          </p>
          <Sections />
          <SearchFormDesktop sticky />
        </div>
        <ParallaxScene />
      </div>
    </section>
  );
};

export default HeroDesktop;
