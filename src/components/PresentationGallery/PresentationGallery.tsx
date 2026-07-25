import galleryMountain from '../../assets/images/gallery-mountain.webp';
import galleryMountain240 from '../../assets/images/gallery-mountain-240.webp';
import galleryStreet from '../../assets/images/gallery-street.webp';
import galleryStreet240 from '../../assets/images/gallery-street-240.webp';
import galleryKyoto from '../../assets/images/gallery-kyoto.webp';
import galleryKyoto240 from '../../assets/images/gallery-kyoto-240.webp';
import gallerySantorini from '../../assets/images/gallery-santorini.webp';
import gallerySantorini240 from '../../assets/images/gallery-santorini-240.webp';
import galleryAurora from '../../assets/images/gallery-aurora.webp';
import galleryAurora240 from '../../assets/images/gallery-aurora-240.webp';

export default function PresentationGallery() {
  const cards = [
    {
      img: galleryMountain,
      img240: galleryMountain240,
      alt: 'Alpine mountain path',
      height: 'h-[360px] md:h-[400px]',
    },
    {
      img: galleryStreet,
      img240: galleryStreet240,
      alt: 'Exotic street bazaar',
      height: 'h-[440px] md:h-[480px]',
    },
    {
      img: galleryKyoto,
      img240: galleryKyoto240,
      alt: 'Kyoto autumn garden',
      height: 'h-[320px] md:h-[360px]',
    },
    {
      img: gallerySantorini,
      img240: gallerySantorini240,
      alt: 'Santorini coastal view',
      height: 'h-[440px] md:h-[480px]',
    },
    {
      img: galleryAurora,
      img240: galleryAurora240,
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
                srcSet={`${card.img240} 240w, ${card.img} 640w`}
                sizes="(min-width: 1024px) 200px, (min-width: 640px) 150px, 80px"
                alt={card.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/25" />
            </div>
          ))}
        </div>

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
