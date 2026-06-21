import galleryMountain from '../../assets/images/gallery-mountain.png';
import galleryStreet from '../../assets/images/gallery-street.png';
import galleryKyoto from '../../assets/images/gallery-kyoto.png';
import gallerySantorini from '../../assets/images/gallery-santorini.png';
import galleryAurora from '../../assets/images/gallery-aurora.png';

export default function PresentationGallery() {
  const cards = [
    {
      img: galleryMountain,
      alt: 'Alpine mountain path',
      height: 'h-[360px] md:h-[400px]',
    },
    {
      img: galleryStreet,
      alt: 'Exotic street bazaar',
      height: 'h-[440px] md:h-[480px]',
    },
    {
      img: galleryKyoto,
      alt: 'Kyoto autumn garden',
      height: 'h-[320px] md:h-[360px]',
    },
    {
      img: gallerySantorini,
      alt: 'Santorini coastal view',
      height: 'h-[440px] md:h-[480px]',
    },
    {
      img: galleryAurora,
      alt: 'Aurora Borealis snowy cabin',
      height: 'h-[360px] md:h-[400px]',
    },
  ];

  return (
    <section className="w-full max-w-[1100px] px-4 sm:px-6 lg:px-8">
      <div className="w-full bg-[#121529] py-16 px-6 md:px-10 rounded-[24px] relative overflow-hidden shadow-lg">
        <div className="flex items-center justify-center gap-3 md:gap-4 lg:gap-5 h-[480px] md:h-[540px]">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`flex-1 ${card.height} rounded-2xl overflow-hidden relative shadow-lg`}
            >
              <img
                src={card.img}
                alt={card.alt}
                className="w-full h-full object-cover"
              />
              {/* Subtle dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/25" />
            </div>
          ))}
        </div>

        {/* Absolute centered text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6">
          <h2
            style={{ color: '#ffffff' }}
            className="!text-white text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-center tracking-tight leading-tight max-w-[800px] drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]"
          >
            One journey, countless stories to be told.
          </h2>
        </div>
      </div>
    </section>
  );
}
