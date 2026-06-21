interface LayoutProps {
  images: string[];
  onOpenModal: () => void;
}

export function ThreeImageLayout({ images, onOpenModal }: LayoutProps) {
  return (
    <div className="grid grid-cols-3 gap-2 w-full h-full">
      {/* Main Image (Left, spans 2 columns) */}
      <div
        className="col-span-2 relative overflow-hidden group cursor-pointer"
        onClick={onOpenModal}
      >
        <img
          src={images[0]}
          alt="Main stay view"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Vertical Stack (Right, 1 column containing 2 stacked images) */}
      <div className="col-span-1 grid grid-rows-2 gap-2 h-full">
        {images.slice(1, 3).map((img, index) => (
          <div
            key={index}
            className="relative overflow-hidden group cursor-pointer w-full h-full"
            onClick={onOpenModal}
          >
            <img
              src={img}
              alt={`Stay view ${index + 2}`}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
}
