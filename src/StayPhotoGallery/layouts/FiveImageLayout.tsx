interface LayoutProps {
  images: string[];
  onOpenModal: () => void;
}

export function FiveImageLayout({ images, onOpenModal }: LayoutProps) {
  return (
    <div className="grid grid-cols-4 gap-2 w-full h-full">
      {/* Main Large Image (Left, spans 2 columns and 2 rows) */}
      <div
        className="col-span-2 row-span-2 relative overflow-hidden group cursor-pointer"
        onClick={onOpenModal}
      >
        <img
          src={images[0]}
          alt="Main stay view"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Right Grid (2 columns, 2 rows of secondary images) */}
      {images.slice(1, 5).map((img, index) => (
        <div
          key={index}
          className="relative overflow-hidden group cursor-pointer w-full h-full"
          onClick={onOpenModal}
        >
          <img
            src={img}
            alt={`Detail view ${index + 1}`}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
      ))}
    </div>
  );
}
